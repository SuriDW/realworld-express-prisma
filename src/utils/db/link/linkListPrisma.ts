import prisma from "../prisma";

export default async function linksListPrisma(
  type?: string,
  title?: string,
  overview?: string,
  limit = 20,
  offset = 0
) {
  const links = await prisma.link.findMany({
    where: {
      type,
      title: title ? { contains: title } : undefined,
      overview: overview ? { contains: overview } : undefined,
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
    },
  });
  return links;
}
