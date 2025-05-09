import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

interface RequirementUpdateInput {
  title?: string;
  description?: string;
  content?: string;
  status?: string;
  assigneeUsername?: string | null;
}

/**
 * Requirement update controller that updates a specific requirement by id.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { title, description, content, status, assigneeUsername }: RequirementUpdateInput = req.body.requirement;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await prisma.requirement.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!requirement) {
      return res.status(404).json({
        errors: {
          body: ["Requirement not found"],
        },
      });
    }

    if (requirement.creatorUsername !== currentUser.username) {
      return res.status(403).json({
        errors: {
          body: ["Only the creator can update the requirement"],
        },
      });
    }

    let assignee = null;
    if (assigneeUsername !== undefined) {
      if (assigneeUsername) {
        assignee = await userGetPrisma(assigneeUsername);
        if (!assignee) {
          return res.status(422).json({
            errors: {
              body: ["Assignee not found"],
            },
          });
        }
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;
    if (assigneeUsername !== undefined) updateData.assigneeUsername = assigneeUsername;

    const updatedRequirement = await prisma.requirement.update({
      where: { id },
      data: updateData,
      include: {
        creator: { include: { followedBy: true } },
        assignee: true,
      },
    });

    const requirementView = requirementViewer(updatedRequirement, currentUser);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
