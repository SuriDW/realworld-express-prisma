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
      title: title ? { contains: title, mode: "insensitive" } : undefined,
      overview: overview ? { contains: overview, mode: "insensitive" } : undefined,
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
