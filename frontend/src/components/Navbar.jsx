import React from 'react'
import { NavLink,Link, useNavigate } from 'react-router-dom';

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
        <Link to="/" className=" font-bold">Q-Swap</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/dashboard" className={({isActive})=>isActive?" font-bold text-orange-400":" text-black"}>Dashboard</NavLink>
          <NavLink to="/book" className={({isActive})=>isActive?" font-bold text-orange-400":" text-black"}>Book Queue</NavLink>
          <NavLink to="/helper" className={({isActive})=>isActive?" font-bold text-orange-400":" text-black"}>Helper</NavLink>
          {!token ? (
            <>
              <NavLink to="/login" className={({isActive})=>isActive?" font-bold text-orange-400":" text-black"}>Login</NavLink>
              <NavLink to="/signup" className={({isActive})=>isActive?" font-bold text-orange-400":" text-black"}>Signup</NavLink>
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
