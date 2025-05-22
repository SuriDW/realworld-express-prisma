import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementGetPrisma from "../../utils/db/requirement/requirementGetPrisma";
import requirementUpdatePrisma from "../../utils/db/requirement/requirementUpdatePrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

interface UpdateFields {
  title?: string;
  description?: string;
  body?: string;
  priority?: string;
  status?: string;
  deadline?: Date | string;
  projectId?: number;
  teamId?: number;
}

export default async function requirementsUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const username = req.auth?.user?.username;
  const updateFields: UpdateFields = req.body.requirement;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const requirement = await requirementGetPrisma(slug);
    if (!requirement) return res.sendStatus(404);

    if (requirement.authorUsername !== currentUser.username)
      return res.sendStatus(403);

    if (updateFields.deadline && typeof updateFields.deadline === 'string') {
      updateFields.deadline = new Date(updateFields.deadline);
    }

    const updatedRequirement = await requirementUpdatePrisma(slug, updateFields);

    const requirementView = requirementViewer(updatedRequirement);
    return res.json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
