import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate query parameters for todo listing controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function todosListValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  if (req.query.limit !== undefined) {
    const limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 0) {
      errors.body.push("limit must be a non-negative number");
    }
  }

  if (req.query.offset !== undefined) {
    const offset = parseInt(req.query.offset as string);
    if (isNaN(offset) || offset < 0) {
      errors.body.push("offset must be a non-negative number");
    }
  }

  if (req.query.status !== undefined && typeof req.query.status !== "string") {
    errors.body.push("status must be a string");
  }

  if (req.query.priority !== undefined) {
    const priority = parseInt(req.query.priority as string);
    if (isNaN(priority)) {
      errors.body.push("priority must be a number");
    }
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
