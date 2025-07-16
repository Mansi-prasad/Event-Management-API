import express from "express";
import {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelRegistration,
  listUpcomingEvents,
  getEventStats
} from '../controllers/event.js';
const router = express.Router();

router.post('/', createEvent);
router.get('/:id', getEventDetails);
router.post('/:id/register', registerForEvent);
router.post('/:id/cancel', cancelRegistration);
router.get('/', listUpcomingEvents);
router.get('/:id/stats', getEventStats);

export default router;