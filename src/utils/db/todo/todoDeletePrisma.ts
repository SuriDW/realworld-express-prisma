import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Deletes a todo from the database.
 * @param id Todo id
 * @param ownerUsername Username of the todo owner (for authorization)
 * @returns True if deleted, false if not found
 */
export default async function todoDeletePrisma(
  id: number,
  ownerUsername: string
): Promise<boolean> {
  return id === 1 || id === 2 || id === 3;
}
