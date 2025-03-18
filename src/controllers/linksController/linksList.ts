import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ParsedQs } from "qs";
import linksListPrisma from "../../utils/db/link/linkListPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import linkViewer from "../../view/linkViewer";

function parseLinkListQuery(query: ParsedQs) {
  let { type, title, overview } = query;
  const { limit, offset } = query;
  type = type ? (type as string) : undefined;
  title = title ? (title as string) : undefined;
  overview = overview ? (overview as string) : undefined;
  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;
  return { type, title, overview, limit: limitNumber, offset: offsetNumber };
}

export default async function linksList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { type, title, overview, limit, offset } = parseLinkListQuery(req.query);
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);

    const links = await linksListPrisma(type, title, overview, limit, offset);

    const linksListView = links.map((link) =>
      currentUser ? linkViewer(link, currentUser) : linkViewer(link)
    );

    return res.json({
      links: linksListView,
      linksCount: linksListView.length,
    });
  } catch (error) {
    return next(error);
  }
}
