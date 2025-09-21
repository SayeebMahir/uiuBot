import { Router } from 'express';
import { register, login, verify2fa, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify2fa);
router.post('/logout', logout);

export default router;

