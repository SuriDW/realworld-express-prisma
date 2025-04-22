import prisma from "../prisma";

interface TodoUpdateFields {
  title?: string;
  description?: string;
  completed?: boolean;
}

export default async function todoUpdatePrisma(
  id: number,
  data: TodoUpdateFields,
  userUsername: string
) {
  const todo = await prisma.todo.update({
    where: {
      id,
      userUsername,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      user: { select: { username: true } },
    },
  });
  return todo;
}
