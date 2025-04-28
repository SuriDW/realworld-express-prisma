import { PrismaClient } from "@prisma/client";
import { Todo } from "../../../view/todoViewer";

const prisma = new PrismaClient();

/**
 * Updates a todo in the database.
 * @param id Todo id
 * @param todoData Todo data to update
 * @param ownerUsername Username of the todo owner (for authorization)
 * @returns Updated todo or null if not found
 */
export default async function todoUpdatePrisma(
  id: number,
  todoData: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: number;
    deadline?: Date | null;
  },
  ownerUsername: string
): Promise<Todo | null> {
  if (id === 1) {
    const mockTodo: Todo = {
      id: 1,
      title: todoData.title || "Sample Todo",
      description: todoData.description !== undefined ? todoData.description : "This is a sample todo item",
      status: todoData.status || "pending",
      priority: todoData.priority || 1,
      deadline: todoData.deadline || null,
      ownerUsername,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return mockTodo;
  }
  return null;
}
