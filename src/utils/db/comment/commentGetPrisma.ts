import prisma from "../prisma";

export default async function commentGetPrisma(
  articleSlug?: string,
  requirementSlug?: string
) {
  const comments = await prisma.comment.findMany({
    where: {
      articleSlug,
      requirementSlug
    },
    include: { author: { include: { followedBy: true } } },
    orderBy: { createdAt: "desc" },
  });
  return comments;
}
