import prisma from "../prisma";

export default async function todoListPrisma(
  userUsername: string,
  completed?: boolean,
  limit?: number,
  offset?: number
) {
  const todos = await prisma.todo.findMany({
    where: {
      userUsername,
      ...(completed !== undefined && { completed }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
    include: {
      user: { select: { username: true } },
    },
  });
  return todos;
}
