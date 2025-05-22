import prisma from "../prisma";

export default async function teamListPrisma(
  username?: string,
  limit = 20,
  offset = 0
) {
  const teams = await prisma.team.findMany({
    where: {
      members: username ? { some: { username } } : undefined,
    },
    take: limit,
    skip: offset,
    orderBy: { name: "asc" },
    include: {
      _count: { 
        select: { 
          members: true,
          requirements: true,
          projects: true,
        } 
      },
    },
  });
  return teams;
}
