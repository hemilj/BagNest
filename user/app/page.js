'use client';
import { useEffect, useState } from 'react';
import API from '../lib/axios';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Link from 'next/link';

const PROMISES = [
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"></path><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle></svg>, 
    title: 'Complimentary Shipping', 
    desc: 'On all orders above ₹999' 
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 8v6h6"></path><path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path></svg>, 
    title: 'Seamless Returns', 
    desc: '15-day exchange policy' 
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, 
    title: 'Secure Checkout', 
    desc: 'Encrypted transactions' 
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>, 
    title: 'Premium Quality', 
    desc: 'Expertly crafted' 
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          API.get('/products?featured=true&limit=8'),
          API.get('/products?limit=8'),
        ]);
        setFeatured(featRes.data.products);
        setNewArrivals(newRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <Banner />

      {/* Brand Promises */}
      <div className="glass-card mx-4 sm:mx-6 my-12 rounded-3xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {PROMISES.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <span className="text-white mt-1">{p.icon}</span>
              <div>
                <p className="font-playfair font-normal text-white text-lg mb-1">{p.title}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <CategorySection />

      {/* Featured Products */}
      <section className="py-20 relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3 block">Signature Styles</span>
              <h2 className="font-playfair text-3xl md:text-4xl text-white font-normal">Featured Picks</h2>
            </div>
            <Link href="/products?featured=true" className="text-[10px] uppercase tracking-[0.2em] text-white hover:text-gray-300 transition-colors mt-4 md:mt-0 pb-1 border-b border-white hover:border-gray-300">
              View All Featured
            </Link>
          </div>
          {loading ? (
            <Loader text="Curating collection..." />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <div className="glass-card mx-4 sm:mx-6 my-24 py-24 rounded-3xl relative z-10 shadow-2xl border-white/20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-6 block">Exclusive Access</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-normal text-white mb-6 leading-tight">Elevate Your Collection.</h2>
          <p className="text-gray-300 font-light mb-10 max-w-xl mx-auto leading-relaxed">Discover our most sought-after silhouettes of the season. Available for a limited time.</p>
          <Link href="/products" className="inline-block border border-white bg-white text-black px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-colors duration-500 rounded-lg font-semibold shadow-xl">
            Explore the Edit
          </Link>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="py-20 relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3 block">Just Landed</span>
              <h2 className="font-playfair text-3xl md:text-4xl text-white font-normal">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-white hover:text-gray-300 transition-colors mt-4 md:mt-0 pb-1 border-b border-white hover:border-gray-300">
              Shop Latest Additions
            </Link>
          </div>
          {loading ? (
            <Loader text="Loading new arrivals..." />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial */}
      <div className="glass-card mx-4 sm:mx-6 my-24 py-24 text-center rounded-3xl relative z-10 shadow-2xl">
        <h3 className="font-playfair text-3xl text-gray-400 mb-8 italic">"</h3>
        <blockquote className="font-playfair text-2xl md:text-3xl font-light text-white max-w-4xl mx-auto px-6 mb-10 leading-relaxed drop-shadow-sm">
          The craftsmanship is unparalleled. BagNest has redefined how I perceive everyday luxury accessories.
        </blockquote>
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-[1px] bg-white/50 mb-6"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300">Priya S. — Verified Buyer</p>
        </div>
      </div>
    </div>
  );
}
