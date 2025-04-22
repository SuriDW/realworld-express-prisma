import prisma from "../prisma";

export default async function todoGetPrisma(id: number, userUsername?: string) {
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      ...(userUsername && { userUsername }),
    },
    include: {
      user: { select: { username: true } },
    },
  });
  return todo;
}
