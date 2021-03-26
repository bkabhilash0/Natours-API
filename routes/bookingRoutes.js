import express from 'express';
import { getCheckoutSession } from '../controllers/bookingController';
import { auth, restrictTo } from '../controllers/authController';

const router = new express.Router();

router.get('/checkout-session/:tourId', auth, getCheckoutSession);

export default router;
