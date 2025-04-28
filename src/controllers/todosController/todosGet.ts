import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";
import todoViewer from "../../view/todoViewer";

/**
 * Todo controller that gets a specific todo by id.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  const userName = req.auth?.user?.username;

  try {
    const todo = await todoGetPrisma(id, userName);
    
    if (!todo) {
      return res.status(404).json({ 
        errors: { body: ["Todo not found"] } 
      });
    }

    if (todo.ownerUsername !== userName) {
      return res.status(403).json({ 
        errors: { body: ["You are not authorized to access this todo"] } 
      });
    }

    const todoView = todoViewer(todo);
    return res.json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
