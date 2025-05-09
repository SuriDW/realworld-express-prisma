import { Requirement } from "@prisma/client";
import prisma from "../prisma";

interface RequiredFields {
  title: string;
  description: string;
  content: string;
  status: string;
}

export default async function requirementCreatePrisma(
  info: RequiredFields,
  creatorUsername: string,
  assigneeUsername?: string
) {
  const requirement = await prisma.requirement.create({
    data: {
      ...info,
      creatorUsername,
      assigneeUsername,
    },
    include: {
      creator: { include: { followedBy: true } },
      assignee: true,
    },
  });
  return requirement;
}
