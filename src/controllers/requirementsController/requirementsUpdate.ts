import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";
import { REQUIREMENT_PRIORITY, REQUIREMENT_STATUS } from "../../utils/db/requirement/requirementCreatePrisma";

interface RequirementUpdateData {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  assigneeUsername?: string;
}

/**
 * Requirements update controller that must receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const { title, description, priority, status, dueDate, assigneeUsername }: RequirementUpdateData = req.body.requirement;
    const userName = req.auth?.user?.username;

    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await prisma.requirement.findUnique({
      where: { slug },
      include: {
        creator: true,
        assignee: true,
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
          take: 1,
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

    if (requirement.creatorUsername !== currentUser.username && 
        requirement.assigneeUsername !== currentUser.username) {
      return res.status(403).json({
        errors: {
          body: ["only creator or assignee can update requirement"],
        },
      });
    }

    let assigneeUser = undefined;
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

    const latestVersion = requirement.versions[0];
    const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
    
    const isContentChanged = 
      description !== undefined || 
      priority !== undefined || 
      status !== undefined || 
      dueDate !== undefined;

    const updatedRequirement = await prisma.$transaction(async (tx) => {
      if (isContentChanged) {
        await tx.requirementVersion.create({
          data: {
            versionNumber: newVersionNumber,
            description: description || requirement.description,
            priority: priority || requirement.priority,
            status: status || requirement.status,
            dueDate: dueDate ? new Date(dueDate) : requirement.dueDate,
            requirementId: requirement.id,
          },
        });
      }

      return await tx.requirement.update({
        where: { id: requirement.id },
        data: {
          title: title || undefined,
          slug: title ? title.toLowerCase().replace(/\s+/g, "-") : undefined,
          description: description || undefined,
          priority: priority || undefined,
          status: status || undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          assigneeUsername: assigneeUsername !== undefined ? assigneeUsername : undefined,
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
    });

    const requirementView = requirementViewer(updatedRequirement, currentUser);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
