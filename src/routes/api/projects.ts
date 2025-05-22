import { Router } from "express";
import * as projects from "../../controllers/projectsController";
import * as validator from "../../middleware/projectsValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.optionalAuthenticate,
  validator.projectsListValidator,
  projects.projectsList
);

export default router;
