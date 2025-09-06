import React, { useEffect, useState } from 'react';
import API from '../api';
import useSocket from '../hooks/useSocket';


const Dashboard = () => {
   const socketRef = useSocket();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchBookings();
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('bookingAssigned', data => {
      fetchBookings();
    });
    socket.on('bookingCompleted', data => {
      fetchBookings();
    });

    return () => {
      if (socket) {
        socket.off('bookingAssigned');
        socket.off('bookingCompleted');
      }
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="bg-white p-4 rounded shadow">
        <p className="mb-2">Welcome, <strong>{user?.name}</strong> — role: {user?.role}</p>
        {user?.role === 'helper' && <p className="text-sm text-slate-600">Open your Helper page to receive nearby booking alerts.</p>}
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-medium mb-2">Your bookings</h3>
        {loading ? <div>Loading...</div> : (
          bookings.length === 0 ? <div className="text-slate-600">No bookings yet.</div> :
          <ul className="space-y-3">
            {bookings.map(b => (
              <li key={b._id} className="bg-white p-3 rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{b.queueType} — {b.locationName}</div>
                    <div className="text-sm text-slate-600">Status: {b.status}</div>
                    <div className="text-sm text-slate-600">Amount: ₹{b.amount}</div>
                  </div>
                  <div>
                    <div className="text-sm">{new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard
