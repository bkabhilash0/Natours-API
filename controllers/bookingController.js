// import stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import Tour from '../models/tourModel';
import Booking from '../models/bookingModel';
import catchAsync from '../utils/catchAsync';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handlerFactory';
import AppError from '../utils/AppError';

// stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
    // * Get the Currently Booked Tour
    const id = req.params.tourId;
    const tour = await Tour.findById(id);
    // * Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${id}&user=${
            req.user._id
        }&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: `${tour.summary}`,
                amount: tour.price * 100,
                currency: 'INR',
                quantity: 1,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`,
                ],
            },
        ],
    });
    // * Create Session as Response
    res.status(200).json({
        status: 'success',
        session,
    });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
    // * This is an unsecure method coz ppl can book by hardcoding the url
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();

    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
});

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
