import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

/**
 * Requirements assign controller that must receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsAssign(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const { assigneeUsername } = req.body.requirement;
    const userName = req.auth?.user?.username;

    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await prisma.requirement.findUnique({
      where: { slug },
      include: {
        creator: {
          include: {
            followedBy: true,
          },
        },
        assignee: {
          include: {
            followedBy: true,
          },
        },
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    });

    if (!requirement) {
      return res.status(404).json({
        errors: {
          body: ["requirement not found"],
        },
      });
    }

    if (requirement.creatorUsername !== currentUser.username) {
      return res.status(403).json({
        errors: {
          body: ["only creator can assign requirement"],
        },
      });
    }

    let assigneeUser = null;
    if (assigneeUsername) {
      assigneeUser = await userGetPrisma(assigneeUsername);
      if (!assigneeUser) {
        return res.status(422).json({
          errors: {
            body: ["assignee not found"],
          },
        });
      }
    }

    const updatedRequirement = await prisma.requirement.update({
      where: { id: requirement.id },
      data: {
        assigneeUsername: assigneeUsername || null,
        updatedAt: new Date(),
      },
      include: {
        creator: {
          include: {
            followedBy: true,
          },
        },
        assignee: {
          include: {
            followedBy: true,
          },
        },
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    });

    const requirementView = requirementViewer(updatedRequirement, currentUser);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
