import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import todoCreatePrisma from "../../utils/db/todo/todoCreatePrisma";
import todoViewer from "../../view/todoViewer";
import userGetPrisma from "../../utils/db/user/userGetPrisma";

interface TodoCreate {
  title: string;
  description?: string;
}

export default async function todoCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description }: TodoCreate = req.body.todo;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    const todo = await todoCreatePrisma(
      { title, description },
      currentUser.username
    );

    const todoView = todoViewer(todo);
    return res.status(201).json({ todo: todoView });
  } catch (error) {
    return next(error);
  }
}
