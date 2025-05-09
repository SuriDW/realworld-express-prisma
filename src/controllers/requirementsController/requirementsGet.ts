import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

/**
 * Requirement get controller that returns a specific requirement by id.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = userName ? await userGetPrisma(userName) : null;

    const requirement = await prisma.requirement.findUnique({
      where: { id },
      include: {
        creator: { include: { followedBy: true } },
        assignee: true,
      },
    });

    if (!requirement) {
      return res.status(404).json({
        errors: {
          body: ["Requirement not found"],
        },
      });
    }

    const requirementView = requirementViewer(requirement, currentUser);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
