import prisma from "../prisma";

export default async function commentGetByIdPrisma(id: number) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { author: { include: { followedBy: true } } },
  });
  return comment;
}
