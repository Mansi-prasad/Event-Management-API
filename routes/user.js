import express from "express";
import {
  createUserController,
  listUsersController,
} from "../controllers/user.js";

const router = express();

router.post("/", createUserController);
router.get("/", listUsersController);

export default router;