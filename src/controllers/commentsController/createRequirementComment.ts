import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import commentCreatePrisma from "../../utils/db/comment/commentCreatePrisma";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import commentViewer from "../../view/commentViewer";

export default async function createRequirementComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const { body } = req.body.comment;
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    const comment = await commentCreatePrisma(
      slug,
      body,
      currentUser
    );

    const commentView = commentViewer(comment);
    return res.status(201).json({ comment: commentView });
  } catch (error) {
    return next(error);
  }
}
