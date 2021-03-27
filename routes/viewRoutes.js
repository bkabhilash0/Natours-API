import express from 'express';
import { auth, isLoggedIn } from '../controllers/authController';
import { createBookingCheckout } from '../controllers/bookingController';
import {
    getMyTours,
    getOverview,
    getTour,
    login,
    me,
    signup,
    updateUserData,
} from '../controllers/viewsController';

const router = new express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/my-tours', auth, getMyTours);
router.get('/login', isLoggedIn, login);
router.get('/tours/:slug', isLoggedIn, getTour);
router.get('/me', auth, me);
router.post('/submit-user-data', auth, updateUserData);
router.get('/signup', signup);

export default router;
