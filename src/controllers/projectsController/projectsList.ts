import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ParsedQs } from "qs";
import projectListPrisma from "../../utils/db/project/projectListPrisma";
import projectViewer from "../../view/projectViewer";

function parseProjectListQuery(query: ParsedQs) {
  const { team, limit, offset } = query;
  const teamId = team ? parseInt(team as string) : undefined;
  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;
  return { teamId, limit: limitNumber, offset: offsetNumber };
}

export default async function projectsList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { teamId, limit, offset } = parseProjectListQuery(req.query);

  try {
    const projects = await projectListPrisma(teamId, limit, offset);

    const projectsListView = projects.map(projectViewer);

    return res.json({
      projects: projectsListView,
      projectsCount: projectsListView.length,
    });
  } catch (error) {
    return next(error);
  }
}
