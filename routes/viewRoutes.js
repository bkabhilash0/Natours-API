import express from 'express';
import { auth, isLoggedIn } from '../controllers/authController';
import { getOverview, getTour, login } from '../controllers/viewsController';

const router = new express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/login', login);
router.get('/tours/:slug', getTour);

export default router;
