// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// our imported pages are here
import Header from './Components/Header';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import BookingsPage from './Pages/BookingsPage';
import SearchFlightsPage from './Pages/SearchFlightsPage';
import FlightStatusPage from './Pages/FlightStatusPage';
import ProfileSettingsPage from './Pages/ProfileSettingsPage';
import TravelInsightsPage from './Pages/TravelInsightsPage';
import NotificationsPage from './Pages/NotificationsPage';
import SpecialOffersPage from './Pages/SpecialOffersPage';
import AccommodationPage from './Pages/AccommodationPage';
import PaymentPage from './Pages/PaymentPage';
import MagazinePage from './Pages/MagazinePage';
import MarketplacePage from './Pages/MarketplacePage';
import AdminDashboardPage from './Pages/AdminDashboardPage';
import AdminUsersPage from './Pages/AdminUsersPage';
import AdminFlightsPage from './Pages/AdminFlightsPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/search-flights" element={<SearchFlightsPage />} />
        <Route path="/flight-status" element={<FlightStatusPage />} />
        <Route path="/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="/travel-insights" element={<TravelInsightsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/special-offers" element={<SpecialOffersPage />} />
        <Route path="/accommodation" element={<AccommodationPage />} />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/flights" element={<AdminFlightsPage />} />
      </Routes>
    </>
  );
}

export default App;
