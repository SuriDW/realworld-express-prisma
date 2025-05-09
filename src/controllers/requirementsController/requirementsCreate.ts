import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementCreatePrisma from "../../utils/db/requirement/requirementCreatePrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

interface RequirementInput {
  title: string;
  description: string;
  content: string;
  status: string;
  assigneeUsername?: string;
}

/**
 * Requirement controller that must receive a request with an authenticated user.
 * The body of the request must have the requirement object that is an @interface RequirementInput.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function requirementsCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, content, status, assigneeUsername }: RequirementInput = req.body.requirement;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    let assignee = null;
    if (assigneeUsername) {
      assignee = await userGetPrisma(assigneeUsername);
      if (!assignee) {
        return res.status(422).json({
          errors: {
            body: ["Assignee not found"],
          },
        });
      }
    }

    const requirement = await requirementCreatePrisma(
      { title, description, content, status },
      currentUser.username,
      assigneeUsername
    );

    const requirementView = requirementViewer(requirement, currentUser);
    return res.status(201).json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
