import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoDeletePrisma from "../../utils/db/todo/todoDeletePrisma";
import todoGetPrisma from "../../utils/db/todo/todoGetPrisma";

export default async function todoDelete(
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
    const existingTodo = await todoGetPrisma(id, userName);
    if (!existingTodo) {
      return res.status(404).json({
        errors: { body: ["todo not found"] }
      });
    }

    await todoDeletePrisma(id, userName);
    
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
