import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    } finally { setLoading(false); }
  }
  return (
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full p-2 border rounded" />
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" type="email" className="w-full p-2 border rounded" />
        <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full p-2 border rounded">
          <option value="customer">Customer</option>
          <option value="helper">Helper</option>
        </select>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Signing...' : 'Sign up'}</button>
      </form>
    </div>
  )
}

export default Signup
