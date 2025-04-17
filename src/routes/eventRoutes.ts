import express from 'express';
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

export default router;