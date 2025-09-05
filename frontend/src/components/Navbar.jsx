import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
   const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

   const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
      <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Q-Swap</Link>
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm">Dashboard</Link>
          <Link to="/book" className="text-sm">Book Queue</Link>
          <Link to="/helper" className="text-sm">Helper</Link>
          {!token ? (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/signup" className="text-sm">Signup</Link>
            </>
          ) : (
            <>
              <span className="text-sm">Hi, {user?.name || 'User'}</span>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
