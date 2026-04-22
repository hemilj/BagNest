'use client';
import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/20">
              <span className="text-slate-900 text-3xl font-extrabold">B</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">BagNest Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wide">Email Address</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@bagnest.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition placeholder-slate-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wide">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition placeholder-slate-500" />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-60 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 bg-slate-800 rounded-xl p-4 text-xs text-slate-400 text-center">
            <p className="font-semibold text-slate-300 mb-1">Default Admin Credentials</p>
            <p>📧 admin@bagnest.com</p>
            <p>🔑 admin123</p>
            <p className="mt-1 text-slate-500">Run <code className="bg-slate-700 px-1 rounded">npm run seed</code> in server folder first</p>
          </div>
        </div>
      </div>
    </div>
  );
}
