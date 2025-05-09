import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import prisma from "../../utils/db/prisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

/**
 * Requirements versions controller that can receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsVersions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const currentUser = req.auth?.user?.username
      ? await userGetPrisma(req.auth.user.username)
      : null;

    const requirement = await prisma.requirement.findUnique({
      where: { slug },
      include: {
        creator: true,
        assignee: true,
      },
    });

    if (!requirement) {
      return res.status(404).json({
        errors: {
          body: ["requirement not found"],
        },
      });
    }

    const versions = await prisma.requirementVersion.findMany({
      where: { requirementId: requirement.id },
      orderBy: {
        versionNumber: "desc",
      },
    });

    return res.json({
      versions,
      versionsCount: versions.length,
      requirement: {
        id: requirement.id,
        slug: requirement.slug,
        title: requirement.title,
        creatorUsername: requirement.creatorUsername,
        assigneeUsername: requirement.assigneeUsername,
      },
    });
  } catch (error) {
    return next(error);
  }
}
