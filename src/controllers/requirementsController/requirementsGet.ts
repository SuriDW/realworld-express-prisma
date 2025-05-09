import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

/**
 * Requirements get controller that can receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUser = req.auth?.user?.username
      ? await userGetPrisma(req.auth.user.username)
      : null;

    const { slug } = req.params;

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

    const requirementView = requirementViewer(requirement, currentUser || undefined);

    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
