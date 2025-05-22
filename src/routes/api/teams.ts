import { Router } from "express";
import * as teams from "../../controllers/teamsController";
import * as validator from "../../middleware/teamsValidator";
import * as auth from "../../middleware/auth/authenticator";

const router = Router();

router.get(
  "/",
  auth.optionalAuthenticate,
  validator.teamsListValidator,
  teams.teamsList
);

export default router;
