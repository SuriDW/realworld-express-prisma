import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import commentDeletePrisma from "../../utils/db/comment/commentDeletePrisma";
import commentGetByIdPrisma from "../../utils/db/comment/commentGetByIdPrisma";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

export default async function deleteRequirementComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug, id } = req.params;
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    const comment = await commentGetByIdPrisma(parseInt(id));
    if (!comment) return res.sendStatus(404);

    if (comment.requirementSlug !== slug) return res.sendStatus(404);

    if (comment.authorUsername !== currentUser.username)
      return res.sendStatus(403);

    await commentDeletePrisma(parseInt(id));

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
