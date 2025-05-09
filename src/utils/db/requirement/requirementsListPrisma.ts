import prisma from "../prisma";

interface RequirementsListParams {
  status?: string;
  creator?: string;
  assignee?: string;
  limit: number;
  offset: number;
}

export default async function requirementsListPrisma({
  status,
  creator,
  assignee,
  limit,
  offset,
}: RequirementsListParams) {
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (creator) {
    where.creatorUsername = creator;
  }

  if (assignee) {
    where.assigneeUsername = assignee;
  }

  const requirements = await prisma.requirement.findMany({
    where,
    include: {
      creator: { include: { followedBy: true } },
      assignee: true,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  return requirements;
}
