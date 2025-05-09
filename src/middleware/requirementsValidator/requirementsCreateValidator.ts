import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import validationErrorHandler from "../validationErrorHandler";
import { REQUIREMENT_PRIORITY, REQUIREMENT_STATUS } from "../../utils/db/requirement/requirementCreatePrisma";

export default [
  body("requirement.title")
    .exists()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("title must be between 1 and 255 characters"),
  body("requirement.description")
    .exists()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be a string"),
  body("requirement.priority")
    .optional()
    .isString()
    .withMessage("priority must be a string")
    .isIn(Object.values(REQUIREMENT_PRIORITY))
    .withMessage(`priority must be one of: ${Object.values(REQUIREMENT_PRIORITY).join(", ")}`),
  body("requirement.status")
    .optional()
    .isString()
    .withMessage("status must be a string")
    .isIn(Object.values(REQUIREMENT_STATUS))
    .withMessage(`status must be one of: ${Object.values(REQUIREMENT_STATUS).join(", ")}`),
  body("requirement.dueDate")
    .optional()
    .isISO8601()
    .withMessage("dueDate must be a valid ISO8601 date"),
  body("requirement.assigneeUsername")
    .optional()
    .isString()
    .withMessage("assigneeUsername must be a string"),
  validationErrorHandler,
];
