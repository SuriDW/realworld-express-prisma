import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";
import { REQUIREMENT_PRIORITY, REQUIREMENT_STATUS } from "../../utils/db/requirement/requirementCreatePrisma";

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

  const { title, description, priority, status, dueDate, assigneeUsername } = req.body.requirement;

  if (
    title === undefined &&
    description === undefined &&
    priority === undefined &&
    status === undefined &&
    dueDate === undefined &&
    assigneeUsername === undefined
  ) {
    errors.body.push("at least one field must be provided");
  }

  if (title !== undefined && (typeof title !== "string" || title.length === 0)) {
    errors.body.push("title must be a non-empty string");
  }

  if (description !== undefined && (typeof description !== "string" || description.length === 0)) {
    errors.body.push("description must be a non-empty string");
  }

  if (priority !== undefined) {
    if (typeof priority !== "string") {
      errors.body.push("priority must be a string");
    } else if (!Object.values(REQUIREMENT_PRIORITY).includes(priority)) {
      errors.body.push(`priority must be one of: ${Object.values(REQUIREMENT_PRIORITY).join(", ")}`);
    }
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      errors.body.push("status must be a string");
    } else if (!Object.values(REQUIREMENT_STATUS).includes(status)) {
      errors.body.push(`status must be one of: ${Object.values(REQUIREMENT_STATUS).join(", ")}`);
    }
  }

  if (dueDate !== undefined) {
    if (typeof dueDate !== "string") {
      errors.body.push("dueDate must be a string");
    } else {
      try {
        new Date(dueDate);
      } catch (e) {
        errors.body.push("dueDate must be a valid date string");
      }
    }
  }

  if (assigneeUsername !== undefined && assigneeUsername !== null && typeof assigneeUsername !== "string") {
    errors.body.push("assigneeUsername must be a string or null");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
