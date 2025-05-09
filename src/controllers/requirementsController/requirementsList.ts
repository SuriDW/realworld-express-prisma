import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementsListPrisma from "../../utils/db/requirement/requirementsListPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

/**
 * Requirements list controller that returns a list of requirements.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status, creator, assignee, limit = 20, offset = 0 } = req.query;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = userName ? await userGetPrisma(userName) : null;

    const requirements = await requirementsListPrisma({
      status: status as string,
      creator: creator as string,
      assignee: assignee as string,
      limit: Number(limit),
      offset: Number(offset),
    });

    const requirementsView = requirements.map((requirement) =>
      requirementViewer(requirement, currentUser)
    );

    return res.json({
      requirements: requirementsView,
      requirementsCount: requirementsView.length,
    });
  } catch (error) {
    return next(error);
  }
}
