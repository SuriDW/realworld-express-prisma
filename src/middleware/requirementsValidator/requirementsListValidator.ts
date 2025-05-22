import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

export default async function requirementsListValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { tag, author, favorited, status, priority, project, team, deadline, limit, offset } = req.query;
  const errors: ValidationError = {};
  errors.query = [];

  if (author && typeof author != "string")
    errors.query.push("author must be a string");

  if (tag && typeof tag != "string") 
    errors.query.push("tag must be a string");

  if (favorited && typeof favorited != "string")
    errors.query.push("favorited must be a string");

  if (status && typeof status != "string")
    errors.query.push("status must be a string");

  if (priority && typeof priority != "string")
    errors.query.push("priority must be a string");

  if (project && typeof project != "string")
    errors.query.push("project must be a string");
  if (project && typeof project == "string") {
    const projectValue = parseInt(project);
    if (isNaN(projectValue)) errors.query.push("project is not a valid number");
  }

  if (team && typeof team != "string")
    errors.query.push("team must be a string");
  if (team && typeof team == "string") {
    const teamValue = parseInt(team);
    if (isNaN(teamValue)) errors.query.push("team is not a valid number");
  }

  if (deadline && typeof deadline != "string")
    errors.query.push("deadline must be a string");
  if (deadline && typeof deadline == "string") {
    const deadlineValue = new Date(deadline);
    if (isNaN(deadlineValue.getTime())) errors.query.push("deadline is not a valid date");
  }

  if (limit && typeof limit != "string")
    errors.query.push("limit must be a string");
  if (limit && typeof limit == "string") {
    const limitValue = parseInt(limit);
    if (isNaN(limitValue)) errors.query.push("limit is not a valid number");
  }

  if (offset && typeof offset != "string")
    errors.query.push("offset must be a string");
  if (offset && typeof offset == "string") {
    const offsetValue = parseInt(offset);
    if (isNaN(offsetValue)) errors.query.push("offset is not a valid number");
  }

  if (errors.query.length > 0) return res.json({ errors });
  return next();
}
