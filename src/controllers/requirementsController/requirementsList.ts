import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementsListPrisma from "../../utils/db/requirement/requirementsListPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

/**
 * Requirements list controller that can receive a request with an authenticated user.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUser = req.auth?.user?.username
      ? await userGetPrisma(req.auth.user.username)
      : null;

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const creator = req.query.creator as string | undefined;
    const assignee = req.query.assignee as string | undefined;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;

    const { requirements, requirementsCount } = await requirementsListPrisma(
      limit,
      offset,
      creator,
      assignee,
      status,
      priority
    );

    const requirementsView = requirements.map((requirement) =>
      requirementViewer(requirement, currentUser || undefined)
    );

    return res.json({
      requirements: requirementsView,
      requirementsCount,
    });
  } catch (error) {
    return next(error);
  }
}
