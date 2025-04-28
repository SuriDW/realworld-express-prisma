import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";
import todoUpdatePrisma from "../../utils/db/todo/todoUpdatePrisma";
import todoViewer from "../../view/todoViewer";

/**
 * Todo controller that updates a specific todo by id.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  const userName = req.auth?.user?.username;
  const { title, description, status, priority, deadline } = req.body.todo;

  try {
    const existingTodo = await todoGetPrisma(id, userName);
    
    if (!existingTodo) {
      return res.status(404).json({ 
        errors: { body: ["Todo not found"] } 
      });
    }

    if (existingTodo.ownerUsername !== userName) {
      return res.status(403).json({ 
        errors: { body: ["You are not authorized to update this todo"] } 
      });
    }

    const todo = await todoUpdatePrisma(
      id,
      { 
        title, 
        description, 
        status, 
        priority, 
        deadline: deadline ? new Date(deadline) : undefined 
      },
      userName
    );

    if (!todo) {
      return res.status(404).json({ 
        errors: { body: ["Todo not found"] } 
      });
    }

    const todoView = todoViewer(todo);
    return res.json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
