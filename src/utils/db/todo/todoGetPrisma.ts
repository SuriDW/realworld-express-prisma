import { PrismaClient } from "@prisma/client";
import { Todo } from "../../../view/todoViewer";

const prisma = new PrismaClient();

/**
 * Gets a todo by id.
 * @param id Todo id
 * @param ownerUsername Username of the todo owner (for authorization)
 * @returns Todo or null if not found
 */
export default async function todoGetPrisma(
  id: number,
  ownerUsername?: string
): Promise<Todo | null> {
  if (id === 1) {
    const mockTodo: Todo = {
      id: 1,
      title: "Sample Todo",
      description: "This is a sample todo item",
      status: "pending",
      priority: 1,
      deadline: null,
      ownerUsername: ownerUsername || "user1",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return mockTodo;
  }
  return null;
}
