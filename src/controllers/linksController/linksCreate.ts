import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import linkViewer from "../../view/linkViewer";

export default async function linksCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, overview, url, type } = req.body.link;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const link = await linkCreatePrisma(
      { title, overview, url, type },
      currentUser.username
    );

    const linkView = linkViewer(link, currentUser);
    return res.status(201).json({ link: linkView });
  } catch (error) {
    return next(error);
  }
}
