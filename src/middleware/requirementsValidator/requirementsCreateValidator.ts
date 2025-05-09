import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate input for requirement creation controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsCreateValidator(
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

  if (!req.body.requirement && typeof req.body.requirement != "object") {
    errors.body.push("requirement must be an object inside body");
    return res.status(400).json({ errors });
  }

  const { title, description, content, status, assigneeUsername } = req.body.requirement;

  const requiredChecks = { title, description, content, status };
  for (const [variable, content] of Object.entries(requiredChecks)) {
    if (typeof content != "string" || content.length == 0) {
      errors.body.push(`${variable} field must be a non-empty string`);
    }
  }

  if (assigneeUsername !== undefined && assigneeUsername !== null && typeof assigneeUsername !== "string") {
    errors.body.push("assigneeUsername must be a string");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
