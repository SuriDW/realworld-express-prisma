import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";
import todoUpdatePrisma from "../../utils/db/todo/todoUpdatePrisma";
import todoViewer from "../../view/todoViewer";

interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export default async function todoUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  const { title, description, completed }: TodoUpdate = req.body.todo;
  const userName = req.auth?.user?.username;

  if (isNaN(id)) {
    return res.status(400).json({ 
      errors: { body: ["id must be a number"] }
    });
  }

  try {
    const existingTodo = await todoGetPrisma(id, userName);
    if (!existingTodo) {
      return res.status(404).json({
        errors: { body: ["todo not found"] }
      });
    }

    const todo = await todoUpdatePrisma(
      id,
      { title, description, completed },
      userName
    );

    const todoView = todoViewer(todo);
    return res.json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
