// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
// Import slices here (e.g., authSlice, flightSlice)
import authReducer from './Features/authSlice';
import flightsReducer from './Features/flightsSlice';
import bookingsReducer from './Features/bookingsSlice';
import specialOffersReducer from './Features/specialOffersSlice';
import travelInsightsReducer from './Features/travelInsightsSlice';
import notificationsReducer from './Features/notificationsSlice';
import adminReducer from './Features/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    bookings: bookingsReducer,
    specialOffers: specialOffersReducer,
    travelInsights: travelInsightsReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
    // add other slices here
  },
});
