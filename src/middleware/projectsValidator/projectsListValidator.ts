import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

export default async function projectsListValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { team, limit, offset } = req.query;
  const errors: ValidationError = {};
  errors.query = [];

  if (team && typeof team != "string")
    errors.query.push("team must be a string");
  if (team && typeof team == "string") {
    const teamValue = parseInt(team);
    if (isNaN(teamValue)) errors.query.push("team is not a valid number");
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
