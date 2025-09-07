import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import API from '../api';

const HelperDashboard = () => {
  const socketRef = useSocket();
  const [available, setAvailable] = useState(false);
  const [nearbyBookings, setNearbyBookings] = useState([]);

  // ✅ Fetch availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await API.get('/helpers/me');  // <-- backend endpoint
        setAvailable(res.data.isAvailable);
      } catch (err) {
        console.error("Failed to load availability", err);
      }
    };
    fetchAvailability();
  }, []);


  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('newBooking', (data) => {
      setNearbyBookings(prev => [data.booking, ...prev]);
    });

     socket.on('newBooking', (data) => {
    setNearbyBookings(prev => [data.booking, ...prev]); 
  });

    return () => {
      if (socket) {
        socket.off('newBooking');
      }
    };
  }, [socketRef]);

  const toggleAvailable = async () => {
    try {
      const res = await API.patch('/helpers/toggle-availability', { available: !available });
      setAvailable(res.data.isAvailable); // ✅ sync with backend response
      alert('Availability updated');
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      await API.post(`/bookings/${bookingId}/assign`);
      alert('Booking accepted');
      setNearbyBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.msg || 'Accept failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Helper Dashboard</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Availability</div>
            <div className="text-sm text-slate-600">Toggle to receive bookings nearby</div>
          </div>
          <button
            onClick={toggleAvailable}
            className={`px-3 py-1 rounded ${available ? 'bg-green-600 text-white' : 'bg-slate-300'}`}
          >
            {available ? 'Available' : 'Go Available'}
          </button>
        </div>
      </div>

      <section>
        <h3 className="font-medium mb-2">Nearby booking requests</h3>
        {nearbyBookings.length === 0 ? (
          <div className="text-slate-600">No nearby bookings yet.</div>
        ) : (
          <ul className="space-y-3">
            {nearbyBookings.map(b => (
  <li key={b._id} className="bg-white p-3 rounded shadow">
    <div className="font-semibold">{b.queueType} — {b.locationName}</div>
    <div className="text-sm text-slate-600">Amount: ₹{b.amount}</div>
    <button onClick={() => acceptBooking(b._id)}>Accept</button>
  </li>
))}

          </ul>
        )}
      </section>
    </div>
  );
};

export default HelperDashboard;
