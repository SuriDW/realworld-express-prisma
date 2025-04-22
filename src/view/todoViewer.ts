import { Todo, User } from "@prisma/client";

type FullTodo = Todo & {
  user: Pick<User, "username">;
};

export default function todoViewer(todo: FullTodo) {
  const todoView = {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    username: todo.user.username,
  };
  return todoView;
}
