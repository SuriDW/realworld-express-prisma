import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

export default async function todoUpdateValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  if (!req.body) {
    errors.body.push("can't be empty");
    return res.status(400).json({ errors });
  }

  if (!req.body.todo && typeof req.body.todo != "object") {
    errors.body.push("todo must be an object inside body");
    return res.status(400).json({ errors });
  }

  const { title, description, completed } = req.body.todo;

  if (title === undefined && description === undefined && completed === undefined) {
    errors.body.push("at least one field (title, description, completed) must be provided");
  }

  if (title !== undefined && (typeof title != "string" || title.length == 0)) {
    errors.body.push("title field must be a non-empty string");
  }

  if (description !== undefined && typeof description != "string") {
    errors.body.push("description field must be a string");
  }

  if (completed !== undefined && typeof completed != "boolean") {
    errors.body.push("completed field must be a boolean");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
