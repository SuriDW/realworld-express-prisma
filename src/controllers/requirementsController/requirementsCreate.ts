import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import requirementCreatePrisma from "../../utils/db/requirement/requirementCreatePrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import requirementViewer from "../../view/requirementViewer";

interface RequirementData {
  title: string;
  description: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  assigneeUsername?: string;
}

/**
 * Requirement controller that must receive a request with an authenticated user.
 * The body of the request must have the requirement object that is an @interface RequirementData.
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
  const { title, description, priority, status, dueDate, assigneeUsername }: RequirementData = req.body.requirement;
  const userName = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(userName);
    if (!currentUser) return res.sendStatus(401);

    let assigneeUser = undefined;
    if (assigneeUsername) {
      assigneeUser = await userGetPrisma(assigneeUsername);
      if (!assigneeUser) {
        return res.status(422).json({
          errors: {
            body: ["assignee not found"],
          },
        });
      }
    }

    const requirement = await requirementCreatePrisma(
      {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeUsername: assigneeUser ? assigneeUser.username : undefined,
      },
      currentUser.username
    );

    const requirementView = requirementViewer(requirement, currentUser);
    return res.status(201).json({ requirement: requirementView });
  } catch (error) {
    return next(error);
  }
}
