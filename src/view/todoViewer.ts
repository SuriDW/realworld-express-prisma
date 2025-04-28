/**
 * Interface for the Todo model from the database.
 */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  deadline: Date | null;
  ownerUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for the Todo view that will be returned to the client.
 */
export interface TodoView {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formats a Todo object for API response.
 * @param todo Todo object from the database
 * @returns TodoView object formatted for API response
 */
export default function todoViewer(todo: Todo): TodoView {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    priority: todo.priority,
    deadline: todo.deadline ? todo.deadline.toISOString() : null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
