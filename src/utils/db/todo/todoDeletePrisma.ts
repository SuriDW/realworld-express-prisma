import prisma from "../prisma";

export default async function todoDeletePrisma(
  id: number,
  userUsername: string
) {
  await prisma.todo.delete({
    where: {
      id,
      userUsername,
    },
  });
}
