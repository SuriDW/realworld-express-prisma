import { Tag } from "@prisma/client";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementCreatePrisma from "../../utils/db/requirement/requirementCreatePrisma";
import tagsCreatePrisma from "../../utils/db/tag/tagsCreatePrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

interface Requirement {
  title: string;
  description: string;
  body: string;
  priority?: string;
  status?: string;
  deadline?: string;
  projectId?: number;
  teamId?: number;
  tagList?: Array<string>;
}

export default async function requirementsCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { 
    title, 
    description, 
    body, 
    priority, 
    status, 
    deadline, 
    projectId, 
    teamId, 
    tagList 
  }: Requirement = req.body.requirement;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    let tags: Tag[] = [];
    if (tagList && tagList.length > 0) {
      tags = await tagsCreatePrisma(tagList);
    }

    const deadlineDate = deadline ? new Date(deadline) : undefined;

    const requirement = await requirementCreatePrisma(
      { 
        title, 
        description, 
        body, 
        priority, 
        status, 
        deadline: deadlineDate, 
        projectId, 
        teamId 
      },
      tags,
      currentUser.username
    );

    const requirementView = requirementViewer(requirement, currentUser);
    return res.status(201).json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
