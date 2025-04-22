import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ParsedQs } from "qs";
import todoListPrisma from "../../utils/db/todo/todoListPrisma";
import todoViewer from "../../view/todoViewer";

function parseTodoListQuery(query: ParsedQs) {
  const { completed } = query;
  const { limit, offset } = query;
  
  const completedBool = completed === "true" ? true : completed === "false" ? false : undefined;
  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;
  
  return { completed: completedBool, limit: limitNumber, offset: offsetNumber };
}

export default async function todoList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { completed, limit, offset } = parseTodoListQuery(req.query);
  const userName = req.auth?.user?.username;

  if (!userName) {
    return res.sendStatus(401);
  }

  try {
    const todos = await todoListPrisma(userName, completed, limit, offset);

    const todosView = todos.map(todo => todoViewer(todo));

    return res.json({
      todos: todosView,
      todosCount: todosView.length,
    });
  } catch (error) {
    return next(error);
  }
}
