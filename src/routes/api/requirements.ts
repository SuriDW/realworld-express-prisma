import { Router } from "express";
import * as requirements from "../../controllers/requirementsController";
import * as validator from "../../middleware/requirementsValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.optionalAuthenticate,
  validator.requirementsListValidator,
  requirements.requirementsList
);

router.get("/:id", auth.optionalAuthenticate, requirements.requirementsGet);

router.post(
  "/",
  auth.authenticate,
  validator.requirementsCreateValidator,
  requirements.requirementsCreate
);

router.put(
  "/:id",
  auth.authenticate,
  validator.requirementsUpdateValidator,
  requirements.requirementsUpdate
);

router.delete("/:id", auth.authenticate, requirements.requirementsDelete);

export default router;
