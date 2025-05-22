import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import commentGetPrisma from "../../utils/db/comment/commentGetPrisma";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import commentViewer from "../../view/commentViewer";

export default async function getRequirementComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;

  try {
    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    const comments = await commentGetPrisma(undefined, slug);
    const commentsView = comments.map(commentViewer);

    return res.json({ comments: commentsView });
  } catch (error) {
    return next(error);
  }
}
