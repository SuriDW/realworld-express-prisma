import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

/**
 * Requirement delete controller that deletes a specific requirement by id.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
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
          body: ["Only the creator can delete the requirement"],
        },
      });
    }

    await prisma.requirement.delete({
      where: { id },
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
