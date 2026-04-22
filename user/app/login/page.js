'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !justLogged) {
      router.push('/');
    }
  }, [user, authLoading, router, justLogged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setJustLogged(true);
      await login(form.email, form.password);
      Swal.fire({
        title: 'Welcome Back',
        text: 'Successfully Authenticated. Redirecting...',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#0a0a0a',
        color: '#ffffff',
        iconColor: '#ffffff'
      }).then(() => {
        router.push('/');
      });
    } catch (err) {
      setJustLogged(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-3xl p-10 md:p-14 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/">
             <span className="font-playfair text-white text-3xl tracking-wider block mb-6 drop-shadow-md">BagNest</span>
          </Link>
          <h1 className="font-playfair text-2xl text-white">Welcome Back</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mt-2">Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-300 block mb-2">Email Address</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full border-b border-white/20 bg-transparent px-2 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-300 block mb-2">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border-b border-white/20 bg-transparent px-2 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-xs px-4 py-3 border border-red-500/20 backdrop-blur-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-white border border-white hover:bg-transparent hover:text-white text-black text-[10px] uppercase tracking-[0.2em] py-4 transition-all duration-500 disabled:opacity-50 mt-6 font-semibold">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            New to BagNest?{' '}
            <Link href="/register" className="text-white border-b border-white hover:text-gray-300 hover:border-gray-300 transition-colors pb-1">Create Account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
