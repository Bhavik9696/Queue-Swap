import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import API from '../api';

const HelperDashboard = () => {
   const socketRef = useSocket();
  const [available, setAvailable] = useState(false);
  const [nearbyBookings, setNearbyBookings] = useState([]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('newBooking', (data) => {
      setNearbyBookings(prev => [data.booking, ...prev]);
    });

    socket.on('assigned', (data) => {
      setNearbyBookings(prev => prev.filter(b => b._id !== data.booking._id));
      alert('Booking assigned: ' + data.booking._id);
    });

    return () => {
      if (socket) {
        socket.off('newBooking');
        socket.off('assigned');
      }
    }
  }, []);

  const toggleAvailable = async () => {
    try {
      const res = await API.patch('/helpers/toggle-availability', { available: !available });
      setAvailable(!available);
      alert('Availability updated');
    } catch (err) {
      alert('Failed to update availability');
    }
  }

  const acceptBooking = async (bookingId) => {
    try {
      const res = await API.post(`/bookings/${bookingId}/assign`);
      alert('Booking accepted');
      setNearbyBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.msg || 'Accept failed');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Helper Dashboard</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Availability</div>
            <div className="text-sm text-slate-600">Toggle to receive bookings nearby</div>
          </div>
          <button onClick={toggleAvailable} className={`px-3 py-1 rounded ${available ? 'bg-green-600 text-white' : 'bg-slate-300'}`}>
            {available ? 'Available' : 'Go Available'}
          </button>
        </div>
      </div>
      <section>
        <h3 className="font-medium mb-2">Nearby booking requests</h3>
        {nearbyBookings.length === 0 ? <div className="text-slate-600">No nearby bookings yet.</div> :
          <ul className="space-y-3">
            {nearbyBookings.map(b => (
              <li key={b._id} className="bg-white p-3 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{b.queueType} — {b.locationName}</div>
                    <div className="text-sm text-slate-600">Amount: ₹{b.amount} • ETA: {b.eta ? new Date(b.eta).toLocaleString() : '—'}</div>
                    <div className="text-sm text-slate-600">Created: {new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>acceptBooking(b._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Accept</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        }
      </section>
       </div>
  )
}

export default HelperDashboard
