import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";
import todoViewer from "../../view/todoViewer";

export default async function todoGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  const userName = req.auth?.user?.username;

  if (isNaN(id)) {
    return res.status(400).json({ 
      errors: { body: ["id must be a number"] }
    });
  }

  try {
    const todo = await todoGetPrisma(id, userName);
    
    if (!todo) {
      return res.status(404).json({
        errors: { body: ["todo not found"] }
      });
    }

    const todoView = todoViewer(todo);
    return res.json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
