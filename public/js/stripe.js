import axios from 'axios';
import { showAlerts } from './alerts';

const stripe = Stripe(
    'pk_test_51IZJH7SF5KU33r31uwGuTmammPe6zG07lNgwkTPKmqfAwWmREsPg1HRRtJhA5jwuRdumvey2WWOkADsnShmUa2iD00b4AP6kKg'
);

export const bookTour = async (tourId) => {
    // * 1. Get the Checkout-Session from the server.
    try {
        const session = await axios.get(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session);
        // * 2. Create the Stripe object to create the checkout form and charge the card.
        await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    } catch (error) {
        console.log(error);
        showAlerts('error', error);
    }
};
