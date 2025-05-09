import prisma from "../prisma";

export default async function requirementsListPrisma(
  limit: number,
  offset: number,
  creator?: string,
  assignee?: string,
  status?: string,
  priority?: string
) {
  const whereClause: any = {};

  if (creator) {
    whereClause.creatorUsername = creator;
  }

  if (assignee) {
    whereClause.assigneeUsername = assignee;
  }

  if (status) {
    whereClause.status = status;
  }

  if (priority) {
    whereClause.priority = priority;
  }

  const requirements = await prisma.requirement.findMany({
    where: whereClause,
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: {
        include: {
          followedBy: true,
        },
      },
      assignee: {
        include: {
          followedBy: true,
        },
      },
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
      },
    },
  });

  const requirementsCount = await prisma.requirement.count({
    where: whereClause,
  });

  return { requirements, requirementsCount };
}
