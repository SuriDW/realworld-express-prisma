import prisma from "../prisma";

export default async function requirementGetPrisma(slug: string) {
  const requirement = await prisma.requirement.findUnique({
    where: { slug },
    include: {
      author: { include: { followedBy: true } },
      tagList: true,
      project: true,
      team: true,
      _count: { select: { favoritedBy: true } },
    },
  });
  return requirement;
}
