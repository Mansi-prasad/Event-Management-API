import express from "express";
import {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelRegistration,
  listUpcomingEvents,
  getEventStatus,
} from "../controllers/event.js";
const router = express.Router();

router.post("/", createEvent);
router.get("/:id", getEventDetails);
router.post("/:id/register", registerForEvent);
router.delete("/:id/cancel", cancelRegistration);
router.get("/", listUpcomingEvents);
router.get("/:id/status", getEventStatus);

export default router;
