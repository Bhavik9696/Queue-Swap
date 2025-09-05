import './App.css'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import HelperDashboard from './pages/HelperDashboard';
import Navbar from './components/Navbar';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/helper" element={<HelperDashboard />} />
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </Elements>
      </div>
    </div>
  );
}

export default App
