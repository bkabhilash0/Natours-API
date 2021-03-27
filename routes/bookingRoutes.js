import express from 'express';
import {
    createBooking,
    deleteBooking,
    getAllBookings,
    getBooking,
    getCheckoutSession,
    updateBooking,
} from '../controllers/bookingController';
import { auth, restrictTo } from '../controllers/authController';

const router = new express.Router();
router.use(auth);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
