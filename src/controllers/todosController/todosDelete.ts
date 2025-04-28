import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";
import todoDeletePrisma from "../../utils/db/todo/todoDeletePrisma";

/**
 * Todo controller that deletes a specific todo by id.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  const userName = req.auth?.user?.username;

  try {
    const existingTodo = await todoGetPrisma(id, userName);
    
    if (!existingTodo) {
      return res.status(404).json({ 
        errors: { body: ["Todo not found"] } 
      });
    }

    if (existingTodo.ownerUsername !== userName) {
      return res.status(403).json({ 
        errors: { body: ["You are not authorized to delete this todo"] } 
      });
    }

    const deleted = await todoDeletePrisma(id, userName);

    if (!deleted) {
      return res.status(404).json({ 
        errors: { body: ["Todo not found"] } 
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
