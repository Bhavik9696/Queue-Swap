import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
    const socket = io(url, {
      auth: { token }
    });

    socket.on('connect', () => console.log('socket connected', socket.id));
    socket.on('disconnect', () => console.log('socket disconnected'));

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
