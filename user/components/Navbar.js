'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 md:py-6 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase text-gray-300">
          <Link href="/products?category=Handbags" className="hover:text-white transition-colors">Handbags</Link>
          <Link href="/products?category=Backpacks" className="hover:text-white transition-colors">Backpacks</Link>
          <Link href="/products?category=Travel Bags" className="hover:text-white transition-colors">Travel</Link>
          <Link href="/products" className="hover:text-white transition-colors">All</Link>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center shrink-0 mx-auto md:mx-0">
          <span className="font-playfair text-white text-3xl md:text-4xl font-normal tracking-wide drop-shadow-md">BagNest</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-6 shrink-0 text-white">
          {/* Search Toggle */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-10 glass-card rounded-xl py-4 w-48 z-50 overflow-hidden">
                  <Link href="/profile" onClick={() => setDropOpen(false)} className="block px-6 py-3 text-xs uppercase tracking-[0.1em] text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    My Profile
                  </Link>
                  <Link href="/profile?tab=orders" onClick={() => setDropOpen(false)} className="block px-6 py-3 text-xs uppercase tracking-[0.1em] text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    My Orders
                  </Link>
                  <button onClick={() => { logout(); setDropOpen(false); }} className="block w-full text-left px-6 py-3 text-xs uppercase tracking-[0.1em] text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors mt-2">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
             <Link href="/login" className="hover:opacity-60 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative hover:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} className="max-w-7xl mx-auto mt-6 px-4 flex justify-center md:justify-end animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex w-full md:w-1/3 border-b border-white/30 focus-within:border-white pb-2 transition-colors">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search our collection..."
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-400 font-light"
              autoFocus
            />
            <button type="submit" className="text-xs font-semibold uppercase tracking-[0.15em] text-white ml-4 hover:text-gray-300 transition-colors">Find</button>
          </div>
        </form>
      )}

      {/* Mobile Links */}
      <div className="md:hidden flex gap-6 overflow-x-auto mt-6 text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 whitespace-nowrap pb-2 hide-scrollbar">
        <Link href="/products?category=Handbags" className="hover:text-white transition-colors">Handbags</Link>
        <Link href="/products?category=Backpacks" className="hover:text-white transition-colors">Backpacks</Link>
        <Link href="/products?category=Travel Bags" className="hover:text-white transition-colors">Travel</Link>
        <Link href="/products?category=Wallets" className="hover:text-white transition-colors">Wallets</Link>
        <Link href="/products" className="hover:text-white transition-colors">All</Link>
      </div>
    </nav>
  );
}
