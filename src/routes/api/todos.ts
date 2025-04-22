import { Router } from "express";
import * as todos from "../../controllers/todoController";
import * as validator from "../../middleware/todoValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.authenticate,
  validator.todoListValidator,
  todos.todoList
);

router.get("/:id([0-9]+)", auth.authenticate, todos.todoGet);

router.post(
  "/",
  auth.authenticate,
  validator.todoCreateValidator,
  todos.todoCreate
);

router.put(
  "/:id([0-9]+)",
  auth.authenticate,
  validator.todoUpdateValidator,
  todos.todoUpdate
);

router.delete("/:id([0-9]+)", auth.authenticate, todos.todoDelete);

export default router;
