import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

/**
 * Requirements delete controller that must receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const userName = req.auth?.user?.username;

    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await prisma.requirement.findUnique({
      where: { slug },
      include: {
        creator: true,
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
          body: ["only creator can delete requirement"],
        },
      });
    }

    await prisma.requirement.delete({
      where: { id: requirement.id },
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
