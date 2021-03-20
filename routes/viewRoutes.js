import express from 'express';
import { auth, isLoggedIn } from '../controllers/authController';
import {
    getOverview,
    getTour,
    login,
    me,
    updateUserData,
} from '../controllers/viewsController';

const router = new express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/login', isLoggedIn, login);
router.get('/tours/:slug', isLoggedIn, getTour);
router.get('/me', auth, me);
router.post('/submit-user-data', auth, updateUserData);

export default router;
