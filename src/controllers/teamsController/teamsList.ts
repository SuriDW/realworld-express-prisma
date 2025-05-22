import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ParsedQs } from "qs";
import teamListPrisma from "../../utils/db/team/teamListPrisma";
import teamViewer from "../../view/teamViewer";

function parseTeamListQuery(query: ParsedQs) {
  const { member, limit, offset } = query;
  const username = member ? (member as string) : undefined;
  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;
  return { username, limit: limitNumber, offset: offsetNumber };
}

export default async function teamsList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, limit, offset } = parseTeamListQuery(req.query);

  try {
    const teams = await teamListPrisma(username, limit, offset);

    const teamsListView = teams.map(teamViewer);

    return res.json({
      teams: teamsListView,
      teamsCount: teamsListView.length,
    });
  } catch (error) {
    return next(error);
  }
}
