'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !justRegistered) {
      router.push('/');
    }
  }, [user, authLoading, router, justRegistered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      setJustRegistered(true);
      await register(form.name, form.email, form.password);
      Swal.fire({
        title: 'Account Created',
        text: 'Welcome to BagNest! Redirecting...',
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
      setJustRegistered(false);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-3xl p-10 md:p-14 relative z-10">
        <div className="text-center mb-10">
          <Link href="/">
             <span className="font-playfair text-white text-3xl tracking-wider block mb-6 drop-shadow-md">BagNest</span>
          </Link>
          <h1 className="font-playfair text-2xl text-white">Create Account</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mt-2">Join Our Community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your name' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '6+ characters' },
            { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: 'Repeat password' },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-[10px] uppercase tracking-widest text-gray-300 block mb-2">{f.label}</label>
              <input type={f.type} required value={form[f.name]}
                onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border-b border-white/20 bg-transparent px-2 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors" />
            </div>
          ))}

          {error && (
            <div className="bg-red-500/10 text-red-400 text-xs px-4 py-3 border border-red-500/20 backdrop-blur-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-white border border-white hover:bg-transparent hover:text-white text-black text-[10px] uppercase tracking-[0.2em] py-4 transition-all duration-500 disabled:opacity-50 mt-6 font-semibold">
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white border-b border-white hover:text-gray-300 hover:border-gray-300 transition-colors pb-1">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
