import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

export default async function todoListValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  const { completed, limit, offset } = req.query;

  if (
    completed !== undefined &&
    completed !== "true" &&
    completed !== "false"
  ) {
    errors.body.push("completed query param must be 'true' or 'false'");
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum <= 0) {
      errors.body.push("limit query param must be a positive number");
    }
  }

  if (offset !== undefined) {
    const offsetNum = parseInt(offset as string);
    if (isNaN(offsetNum) || offsetNum < 0) {
      errors.body.push("offset query param must be a non-negative number");
    }
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
