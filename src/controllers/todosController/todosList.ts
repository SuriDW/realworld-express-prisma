import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoListPrisma from "../../utils/db/todo/todoListPrisma";
import todoViewer from "../../view/todoViewer";

/**
 * Todo controller that lists todos with optional filtering.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userName = req.auth?.user?.username;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
  const status = req.query.status as string | undefined;
  const priority = req.query.priority ? parseInt(req.query.priority as string) : undefined;

  try {
    const todos = await todoListPrisma(
      userName,
      limit,
      offset,
      status,
      priority
    );

    const todoViews = todos.map(todo => todoViewer(todo));
    return res.json({ 
      todos: todoViews,
      todosCount: todoViews.length 
    });
  } catch (error) {
    return next(error);
  }
}
