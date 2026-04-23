'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = product.images?.[0]?.startsWith('http')
    ? product.images[0]
    : `${API_BASE}${product.images?.[0] || ''}`;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCart = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: 'AUTHENTICATION REQUIRED',
        text: "You need to login to access the cart",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#fff',
        cancelButtonColor: '#333',
        confirmButtonText: 'LOGIN NOW',
        cancelButtonText: 'LATER',
        background: '#111',
        color: '#fff',
        iconColor: '#fff',
        customClass: {
          popup: 'glass-card border border-white/10 rounded-2xl font-jost',
          title: 'text-sm tracking-widest',
          confirmButton: 'text-black text-[10px] tracking-widest px-8 py-3 rounded-lg font-bold',
          cancelButton: 'text-white text-[10px] tracking-widest px-8 py-3 rounded-lg'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const stars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="glass-card overflow-hidden transition-all duration-500 border border-white/10 hover:border-white/30 rounded-2xl flex flex-col h-full">
        {/* Image */}
        <div className="relative h-72 overflow-hidden bg-black/20 shrink-0">
          <img
            src={imageUrl || 'https://via.placeholder.com/400x300?text=BagNest'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          {discount > 0 && (
            <span className="absolute top-0 left-0 bg-white text-black font-semibold text-[10px] tracking-widest uppercase px-3 py-1">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[10px] tracking-widest uppercase px-3 py-1">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-black tracking-[0.2em] font-semibold uppercase px-4 py-2 text-[10px]">Sold Out</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 text-center flex flex-col items-center flex-1 justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2">{product.category}</p>
            <h3 className="font-playfair text-white text-lg leading-tight line-clamp-1 mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-white text-xs">{stars(product.rating || 0)}</span>
              <span className="text-[10px] text-gray-400">({product.numReviews || 0})</span>
            </div>

            {/* Price */}
            <div className="flex justify-center items-center gap-3 mb-5">
              {product.originalPrice > product.price && (
                <span className="text-gray-500 line-through text-xs">₹{product.originalPrice?.toLocaleString()}</span>
              )}
              <span className="font-medium text-gray-200 text-sm">₹{product.price?.toLocaleString()}</span>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleCart}
            disabled={adding || product.stock === 0}
            className={`w-full py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 border rounded-lg ${added
              ? 'bg-transparent border-white text-white'
              : product.stock === 0
                ? 'bg-transparent border-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white border-white text-black hover:bg-transparent hover:text-white'
              }`}
          >
            {adding ? 'Adding...' : added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
