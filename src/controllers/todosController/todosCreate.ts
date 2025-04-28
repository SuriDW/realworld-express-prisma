import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoCreatePrisma from "../../utils/db/todo/todoCreatePrisma";
import todoViewer from "../../view/todoViewer";

/**
 * Todo controller that creates a new todo.
 * The body of the request must have the todo object.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, status, priority, deadline } = req.body.todo;
  const userName = req.auth?.user?.username;

  try {
    const todo = await todoCreatePrisma(
      { title, description, status, priority, deadline: deadline ? new Date(deadline) : undefined },
      userName
    );

    const todoView = todoViewer(todo);
    return res.status(201).json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
