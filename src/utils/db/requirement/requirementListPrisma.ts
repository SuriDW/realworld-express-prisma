import prisma from "../prisma";

export default async function requirementsListPrisma(
  tag?: string,
  authorUsername?: string,
  favorited?: string,
  status?: string,
  priority?: string,
  projectId?: number,
  teamId?: number,
  beforeDeadline?: Date,
  limit = 20,
  offset = 0
) {
  const requirements = await prisma.requirement.findMany({
    where: {
      authorUsername,
      tagList: tag ? { some: { tagName: tag } } : undefined,
      favoritedBy: favorited ? { some: { username: favorited } } : undefined,
      status: status || undefined,
      priority: priority || undefined,
      projectId: projectId || undefined,
      teamId: teamId || undefined,
      deadline: beforeDeadline 
        ? { lte: beforeDeadline } 
        : undefined,
    },
    take: limit,
    skip: offset,
    orderBy: { updatedAt: "desc" },
    include: {
      author: { include: { followedBy: true } },
      tagList: true,
      project: true,
      team: true,
      _count: { select: { favoritedBy: true } },
    },
  });
  return requirements;
}
