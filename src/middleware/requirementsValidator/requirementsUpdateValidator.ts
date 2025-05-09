import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate input for requirement update controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsUpdateValidator(
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

  if (
    title === undefined &&
    description === undefined &&
    content === undefined &&
    status === undefined &&
    assigneeUsername === undefined
  ) {
    errors.body.push("At least one field must be provided for update");
    return res.status(400).json({ errors });
  }

  if (title !== undefined && (typeof title !== "string" || title.length === 0)) {
    errors.body.push("title field must be a non-empty string");
  }

  if (description !== undefined && (typeof description !== "string" || description.length === 0)) {
    errors.body.push("description field must be a non-empty string");
  }

  if (content !== undefined && (typeof content !== "string" || content.length === 0)) {
    errors.body.push("content field must be a non-empty string");
  }

  if (status !== undefined && (typeof status !== "string" || status.length === 0)) {
    errors.body.push("status field must be a non-empty string");
  }

  if (
    assigneeUsername !== undefined &&
    assigneeUsername !== null &&
    typeof assigneeUsername !== "string"
  ) {
    errors.body.push("assigneeUsername must be a string or null");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
