import { Router } from 'express';
import {  login, logout, refreshSession  } from './../controllers/authController';

const router = Router();

// Phase 1
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-session', refreshSession);

// Phase 2
// router.get('/profile', getProfile);
// router.put('/profile', updateProfile); 
export default router;
