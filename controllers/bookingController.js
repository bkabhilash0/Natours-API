// import stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import {} from './handlerFactory';
import AppError from '../utils/AppError';

// stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
    // * Get the Currently Booked Tour
    const id = req.params.tourId;
    const tour = await Tour.findById(id);
    console.log(tour);
    // * Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            // {
            //     name: `${tour.name} Tour`,
            //     description: `${tour.summary}`,
            //     amount: tour.price * 100,
            //     currency: 'INR',
            //     quantity: 1,
            // },
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Stubborn Attachments',
                        images: ['https://i.imgur.com/EHyR2nP.png'],
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
    });
    // * Create Session as Response
    res.status(200).json({
        status: 'success',
        session,
    });
});
