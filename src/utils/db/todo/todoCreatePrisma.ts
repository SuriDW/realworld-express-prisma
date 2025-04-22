import prisma from "../prisma";

interface TodoCreateFields {
  title: string;
  description?: string;
}

export default async function todoCreatePrisma(
  info: TodoCreateFields,
  userUsername: string
) {
  const todo = await prisma.todo.create({
    data: {
      ...info,
      userUsername,
    },
    include: {
      user: { select: { username: true } },
    },
  });
  return todo;
}
