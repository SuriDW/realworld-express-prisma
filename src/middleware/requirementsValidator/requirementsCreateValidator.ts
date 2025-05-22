import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

export default async function requirementsCreateValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  if (!req.body.requirement) {
    errors.body.push("requirement object is required");
    return res.status(422).json({ errors });
  }

  const { title, description, body, priority, status, deadline, projectId, teamId, tagList } = req.body.requirement;

  if (!title) errors.body.push("title is required");
  if (title && typeof title != "string")
    errors.body.push("title must be a string");

  if (!description) errors.body.push("description is required");
  if (description && typeof description != "string")
    errors.body.push("description must be a string");

  if (!body) errors.body.push("body is required");
  if (body && typeof body != "string") 
    errors.body.push("body must be a string");

  if (priority && typeof priority != "string")
    errors.body.push("priority must be a string");

  if (status && typeof status != "string")
    errors.body.push("status must be a string");

  if (deadline && typeof deadline != "string")
    errors.body.push("deadline must be a string");
  if (deadline && typeof deadline == "string") {
    const deadlineValue = new Date(deadline);
    if (isNaN(deadlineValue.getTime())) 
      errors.body.push("deadline is not a valid date");
  }

  if (projectId && typeof projectId != "number")
    errors.body.push("projectId must be a number");

  if (teamId && typeof teamId != "number")
    errors.body.push("teamId must be a number");

  if (tagList && !Array.isArray(tagList))
    errors.body.push("tagList must be an array");

  if (errors.body.length > 0) return res.status(422).json({ errors });
  return next();
}
