import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate input for todo creation controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosCreateValidator(
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

  const { title, description, status, priority, deadline } = req.body.todo;

  if (typeof title != "string" || title.length == 0) {
    errors.body.push("title field must be a non-empty string");
  }

  if (typeof status != "string" || status.length == 0) {
    errors.body.push("status field must be a non-empty string");
  }

  if (typeof priority != "number") {
    errors.body.push("priority field must be a number");
  }

  if (description !== undefined && typeof description != "string") {
    errors.body.push("description field must be a string");
  }

  if (deadline !== undefined && deadline !== null) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      errors.body.push("deadline field must be a valid date string");
    }
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
