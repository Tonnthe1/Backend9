import express from 'express';
import { login, signup, refreshToken } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh-token', refreshToken);

export default router;