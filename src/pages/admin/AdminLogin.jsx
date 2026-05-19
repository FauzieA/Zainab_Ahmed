import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a later step, we will hook this up to Django's built-in token auth endpoint
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and staff flags to local browser memory
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_username', username);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid management credentials.');
      }
    } catch (err) {
      setError('Unable to reach the authentication backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 text-[#bfa791]">
      <div className="w-full max-w-md border border-[#bfa791]/20 p-8 md:p-10 bg-white rounded-sm shadow-xs">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#a38c77]/70 block mb-2">— MANAGEMENT —</span>
          <h2 className="font-serif text-2xl text-[#634032] font-light">Internal Workspace</h2>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#634032] font-semibold block">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter administrator identifier"
              className="w-full bg-white border border-[#bfa791]/30 focus:border-[#634032] px-3 py-2.5 text-xs text-[#634032] focus:outline-none rounded-xs transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#634032] font-semibold block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#bfa791]/30 focus:border-[#634032] px-3 py-2.5 text-xs text-[#634032] focus:outline-none rounded-xs transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#634032] text-[#efe9e4] py-3 font-serif italic tracking-wide hover:bg-[#a38c77] hover:text-white transition-all duration-300 cursor-pointer rounded-xs text-center disabled:opacity-40"
          >
            {loading ? 'Verifying...' : 'Access Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}