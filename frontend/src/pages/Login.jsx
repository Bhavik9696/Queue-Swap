import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
     <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" type="email" className="w-full p-2 border rounded" />
        <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? 'Logging...' : 'Login'}</button>
      </form>
    </div>
  )
}

export default Login
