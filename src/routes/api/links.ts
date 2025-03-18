import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../middleware/auth/authenticator";
import linksCreate from "../../controllers/linksController/linksCreate";
import linksList from "../../controllers/linksController/linksList";

const router = Router();

// Get links with optional filtering
router.get("/", optionalAuthenticate, linksList);

// Create a new link
router.post("/", authenticate, linksCreate);

export default router;
