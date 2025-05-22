import prisma from "../prisma";

export default async function projectListPrisma(
  teamId?: number,
  limit = 20,
  offset = 0
) {
  const projects = await prisma.project.findMany({
    where: {
      teamId: teamId || undefined,
    },
    take: limit,
    skip: offset,
    orderBy: { updatedAt: "desc" },
    include: {
      team: true,
      _count: { select: { requirements: true } },
    },
  });
  return projects;
}
