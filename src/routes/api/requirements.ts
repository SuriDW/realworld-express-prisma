import { Router } from "express";
import * as requirements from "../../controllers/requirementsController";
import * as comments from "../../controllers/commentsController";
import * as validator from "../../middleware/requirementsValidator";
import commentCreateValidator from "../../middleware/commentsValidator/commentCreateValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.optionalAuthenticate,
  validator.requirementsListValidator,
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
  "/:slug/comments",
  auth.authenticate,
  commentCreateValidator,
  comments.createRequirementComment
);

router.get("/:slug/comments", auth.optionalAuthenticate, comments.getRequirementComments);

router.delete(
  "/:slug/comments/:id([0-9]+)",
  auth.authenticate,
  comments.deleteRequirementComment
);

router.post("/:slug/favorite", auth.authenticate, requirements.requirementsFavorite);

router.delete(
  "/:slug/favorite",
  auth.authenticate,
  requirements.requirementsUnFavorite
);

export default router;
