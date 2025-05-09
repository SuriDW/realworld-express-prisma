import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate query parameters for requirements list controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsListValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  const { status, creator, assignee, limit, offset } = req.query;

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum <= 0) {
      errors.body.push("limit must be a positive number");
    }
  }

  if (offset !== undefined) {
    const offsetNum = Number(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      errors.body.push("offset must be a non-negative number");
    }
  }

  if (status !== undefined && typeof status !== "string") {
    errors.body.push("status must be a string");
  }

  if (creator !== undefined && typeof creator !== "string") {
    errors.body.push("creator must be a string");
  }

  if (assignee !== undefined && typeof assignee !== "string") {
    errors.body.push("assignee must be a string");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
