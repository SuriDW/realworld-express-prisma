import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementFavoritePrisma from "../../utils/db/requirement/requirementFavoritePrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

export default async function requirementsFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await requirementFavoritePrisma(currentUser, slug);

    const requirementView = requirementViewer(requirement, currentUser);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
