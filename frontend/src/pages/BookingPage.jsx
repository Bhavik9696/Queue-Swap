import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const BookingPage = () => {
  const [form, setForm] = useState({
    queueType: 'bank',
    locationName: '',
    coords: [77.5946, 12.9716],
    amount: 100,
    eta: ''
  });
  const [creating, setCreating] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // attempt to get browser location once
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { longitude, latitude } = pos.coords;
        setForm(f => ({ ...f, coords: [longitude, latitude] }));
      }, () => {});
    }
  }, []);

  const createBooking = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await API.post('/bookings', {
        queueType: form.queueType,
        locationName: form.locationName,
        coords: form.coords,
        amount: form.amount,
        eta: form.eta
      });
      const booking = res.data.booking;
      setBookingId(booking._id);

      // create payment intent
      const pi = await API.post('/payments/create-payment-intent', { bookingId: booking._id });
      setClientSecret(pi.data.clientSecret);
      alert('Booking created. Enter card details and pay below.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.err || 'Booking creation failed');
    } finally { setCreating(false); }
  }

  const pay = async () => {
    if (!stripe || !elements) return alert('Stripe not ready');
    if (!clientSecret) return alert('No payment intent');

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card }
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      alert('Payment successful — booking confirmed');
      nav('/dashboard');
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
      <form onSubmit={createBooking} className="space-y-3">
        <select value={form.queueType} onChange={e=>setForm({...form,queueType:e.target.value})} className="w-full p-2 border rounded">
          <option value="bank">Bank</option>
          <option value="hospital">Hospital</option>
          <option value="government">Government Office</option>
          <option value="canteen">Canteen</option>
          <option value="concert">Concert</option>
        </select>

        <input value={form.locationName} onChange={e=>setForm({...form,locationName:e.target.value})} placeholder="Location name (e.g., SBI Main Branch)" className="w-full p-2 border rounded" />

        <div className="flex gap-2">
          <input value={form.coords[0]} onChange={e=>setForm({...form,coords:[parseFloat(e.target.value)||0, form.coords[1]]})} placeholder="Longitude" className="w-1/2 p-2 border rounded" />
          <input value={form.coords[1]} onChange={e=>setForm({...form,coords:[form.coords[0], parseFloat(e.target.value)||0]})} placeholder="Latitude" className="w-1/2 p-2 border rounded" />
        </div>

        <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:parseFloat(e.target.value)||0})} className="w-full p-2 border rounded" />

        <input type="datetime-local" value={form.eta} onChange={e=>setForm({...form,eta:e.target.value})} className="w-full p-2 border rounded" />

        <button disabled={creating} type="submit" className="w-full bg-blue-600 text-white py-2 rounded">{creating ? 'Creating...' : 'Create Booking & Request Helpers'}</button>
      </form>
    </div>


  )
}

export default BookingPage
