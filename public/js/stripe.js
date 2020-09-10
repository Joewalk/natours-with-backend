/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51GzSODEDr9DWjj2gPMLSz1OtjigNlN7XcXOwKoEu0BtOghzQVyZSXlYneJen6Rhy1pv0RhT9WWyrSbxOxQDNE0cF00C0c2cRig'
);

export const bookTour = async tourId => {
  try {
    // 1) Get chekourt  session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form +  charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};
