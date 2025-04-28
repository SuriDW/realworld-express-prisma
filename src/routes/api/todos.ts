import { Router } from "express";
import * as todos from "../../controllers/todosController";
import * as validator from "../../middleware/todosValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.authenticate,
  validator.todosListValidator,
  todos.todosList
);

router.get("/:id([0-9]+)", auth.authenticate, todos.todosGet);

router.post(
  "/",
  auth.authenticate,
  validator.todosCreateValidator,
  todos.todosCreate
);

router.put(
  "/:id([0-9]+)",
  auth.authenticate,
  validator.todosUpdateValidator,
  todos.todosUpdate
);

router.delete("/:id([0-9]+)", auth.authenticate, todos.todosDelete);

export default router;
