import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ParsedQs } from "qs";
import requirementsListPrisma from "../../utils/db/requirement/requirementListPrisma";
import requirementViewer from "../../view/requirementViewer";

function parseRequirementListQuery(query: ParsedQs) {
  let { tag, author, favorited, status, priority } = query;
  const { project, team, deadline, limit, offset } = query;
  tag = tag ? (tag as string) : undefined;
  author = author ? (author as string) : undefined;
  favorited = favorited ? (favorited as string) : undefined;
  status = status ? (status as string) : undefined;
  priority = priority ? (priority as string) : undefined;
  const projectId = project ? parseInt(project as string) : undefined;
  const teamId = team ? parseInt(team as string) : undefined;
  const beforeDeadline = deadline ? new Date(deadline as string) : undefined;
  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;
  return { 
    tag, 
    author, 
    favorited, 
    status, 
    priority, 
    projectId, 
    teamId, 
    beforeDeadline, 
    limit: limitNumber, 
    offset: offsetNumber 
  };
}

export default async function requirementsList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { 
    tag, 
    author, 
    favorited, 
    status, 
    priority, 
    projectId, 
    teamId, 
    beforeDeadline, 
    limit, 
    offset 
  } = parseRequirementListQuery(req.query);

  try {
    const requirements = await requirementsListPrisma(
      tag,
      author,
      favorited,
      status,
      priority,
      projectId,
      teamId,
      beforeDeadline,
      limit,
      offset
    );

    const requirementsListView = requirements.map((requirement: any) =>
      requirementViewer(requirement)
    );

    return res.json({
      requirements: requirementsListView,
      requirementsCount: requirementsListView.length,
    });
  } catch (error) {
    return next(error);
  }
}
