import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementDeletePrisma from "../../utils/db/requirement/requirementDeletePrisma";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

export default async function requirementsDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    if (requirement.authorUsername !== currentUser.username)
      return res.sendStatus(403);

    await requirementDeletePrisma(slug);

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
