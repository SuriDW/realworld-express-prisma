import { Router } from "express";
import * as requirements from "../../controllers/requirementsController";
import * as validator from "../../middleware/requirementsValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.optionalAuthenticate,
  requirements.requirementsList
);

router.get("/:slug", auth.optionalAuthenticate, requirements.requirementsGet);

router.post(
  "/",
  auth.authenticate,
  validator.requirementsCreateValidator,
  requirements.requirementsCreate
);

router.put(
  "/:slug",
  auth.authenticate,
  validator.requirementsUpdateValidator,
  requirements.requirementsUpdate
);

router.delete("/:slug", auth.authenticate, requirements.requirementsDelete);

router.post(
  "/:slug/assign",
  auth.authenticate,
  requirements.requirementsAssign
);

router.get(
  "/:slug/versions",
  auth.optionalAuthenticate,
  requirements.requirementsVersions
);

export default router;
