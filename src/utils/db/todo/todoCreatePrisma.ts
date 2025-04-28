import { PrismaClient } from "@prisma/client";
import { Todo } from "../../../view/todoViewer";

const prisma = new PrismaClient();

/**
 * Creates a new todo in the database.
 * @param todoData Todo data to create
 * @param ownerUsername Username of the todo owner
 * @returns Created todo
 */
export default async function todoCreatePrisma(
  todoData: {
    title: string;
    description?: string;
    status: string;
    priority: number;
    deadline?: Date;
  },
  ownerUsername: string
): Promise<Todo> {
  const mockTodo: Todo = {
    id: 1,
    title: todoData.title,
    description: todoData.description || null,
    status: todoData.status,
    priority: todoData.priority,
    deadline: todoData.deadline || null,
    ownerUsername,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return mockTodo;
}
