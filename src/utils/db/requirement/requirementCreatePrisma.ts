import prisma from "../prisma";
import slugfy from "../../slugfy";

export const REQUIREMENT_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

export const REQUIREMENT_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

interface RequiredFields {
  title: string;
  description: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  assigneeUsername?: string;
}

export default async function requirementCreatePrisma(
  info: RequiredFields,
  creatorUsername: string
) {
  const slug = slugfy(info.title);
  
  const requirement = await prisma.requirement.create({
    data: {
      title: info.title,
      slug,
      description: info.description,
      priority: info.priority || REQUIREMENT_PRIORITY.MEDIUM,
      status: info.status || REQUIREMENT_STATUS.TODO,
      dueDate: info.dueDate,
      creatorUsername,
      assigneeUsername: info.assigneeUsername,
    },
    include: {
      creator: true,
      assignee: true,
      versions: true,
    },
  });

  await prisma.requirementVersion.create({
    data: {
      versionNumber: 1,
      description: requirement.description,
      priority: requirement.priority,
      status: requirement.status,
      dueDate: requirement.dueDate,
      requirementId: requirement.id,
    },
  });

  return await prisma.requirement.findUnique({
    where: { id: requirement.id },
    include: {
      creator: true,
      assignee: true,
      versions: {
        orderBy: { versionNumber: 'desc' },
      },
    },
  });
}
