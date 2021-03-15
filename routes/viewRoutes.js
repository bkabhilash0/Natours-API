import express from 'express';
import { auth } from '../controllers/authController';
import { getOverview, getTour, login } from '../controllers/viewsController';

const router = new express.Router();

router.get('/', getOverview);
router.get('/login', login);
router.get('/tours/:slug', auth, getTour);

export default router;
