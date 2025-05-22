import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

export default async function requirementsGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);

    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    const requirementView = currentUser
      ? requirementViewer(requirement, currentUser)
      : requirementViewer(requirement);

    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
