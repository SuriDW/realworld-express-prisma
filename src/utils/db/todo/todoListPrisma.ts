import { PrismaClient } from "@prisma/client";
import { Todo } from "../../../view/todoViewer";

const prisma = new PrismaClient();

/**
 * Lists todos with optional filtering.
 * @param ownerUsername Username of the todo owner
 * @param limit Maximum number of todos to return
 * @param offset Number of todos to skip
 * @param status Optional status filter
 * @param priority Optional priority filter
 * @returns Array of todos
 */
export default async function todoListPrisma(
  ownerUsername: string,
  limit: number = 20,
  offset: number = 0,
  status?: string,
  priority?: number
): Promise<Todo[]> {
  const mockTodos: Todo[] = [
    {
      id: 1,
      title: "High Priority Task",
      description: "This is a high priority task",
      status: "pending",
      priority: 1,
      deadline: null,
      ownerUsername,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Medium Priority Task",
      description: "This is a medium priority task",
      status: "in-progress",
      priority: 2,
      deadline: new Date(Date.now() + 86400000), // tomorrow
      ownerUsername,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: "Low Priority Task",
      description: "This is a low priority task",
      status: "completed",
      priority: 3,
      deadline: null,
      ownerUsername,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  let filteredTodos = mockTodos;
  
  if (status) {
    filteredTodos = filteredTodos.filter(todo => todo.status === status);
  }
  
  if (priority !== undefined) {
    filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
  }

  return filteredTodos.slice(offset, offset + limit);
}
