'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '../../../lib/axios';
import Loader from '../../../components/Loader';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setReviews(data.reviews);
      } catch {
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      setAdding(true);
      await addToCart(product._id, qty);
      router.push('/cart');
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    try {
      setSubmitting(true);
      await API.post(`/products/${id}/reviews`, reviewForm);
      setReviewMsg('Review submitted successfully.');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-32 text-center"><Loader text="Curating product details..." /></div>;
  if (!product) return null;

  const imageUrl = (img) => img?.startsWith('http') ? img : `${API_BASE}${img}`;
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 text-white relative z-10">
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Images */}
        <div className="sticky top-28">
          <div className="overflow-hidden glass-card rounded-3xl h-[500px] lg:h-[700px] flex items-center justify-center p-4">
            <img src={imageUrl(product.images?.[activeImg]) || 'https://via.placeholder.com/600x400'} alt={product.name}
              className="w-full h-full object-cover rounded-2xl" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-4 mt-6">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 glass-card rounded-xl overflow-hidden border transition-all duration-300 p-1 ${i === activeImg ? 'border-white' : 'border-transparent hover:border-white/30'}`}>
                  <img src={imageUrl(img)} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pt-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 block">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair text-white mb-6 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-8 border-b border-white/20 pb-8">
            <span className="text-white text-sm">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-l border-white/20 pl-3">{product.numReviews} Reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-2xl font-light text-white">₹{product.price?.toLocaleString()}</span>
            {discount > 0 && <>
              <span className="text-gray-400 line-through text-sm">₹{product.originalPrice?.toLocaleString()}</span>
              <span className="bg-white text-black font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm">{discount}% OFF</span>
            </>}
          </div>

          <p className="text-gray-300 text-sm font-light leading-relaxed mb-10 max-w-xl">{product.description}</p>

          {/* Attrs */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12 border-y border-white/20 py-8">
            {product.material && <div><span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 block mb-1">Material</span><p className="text-sm text-white">{product.material}</p></div>}
            {product.color && <div><span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 block mb-1">Color</span><p className="text-sm text-white">{product.color}</p></div>}
            {product.brand && <div><span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 block mb-1">Brand</span><p className="text-sm text-white">{product.brand}</p></div>}
            <div><span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 block mb-1">Availability</span>
              <p className={`text-sm tracking-wide ${product.stock > 0 ? 'text-white' : 'text-gray-500'}`}>
                {product.stock > 0 ? `In Stock` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Qty + Cart */}
          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center border border-white/30 h-14 w-full sm:w-auto rounded-lg overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-5 text-white hover:bg-white/10 transition-colors h-full">−</button>
                <span className="px-6 font-medium text-white text-sm">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-5 text-white hover:bg-white/10 transition-colors h-full">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding}
                className="flex-1 w-full bg-white border border-white hover:bg-transparent hover:text-white text-black font-semibold rounded-lg text-[10px] uppercase tracking-[0.2em] h-14 transition-colors duration-500">
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          <button onClick={() => { if (!user) router.push('/login'); }}
            className="w-full border border-white/30 text-white rounded-lg text-[10px] uppercase tracking-[0.2em] h-14 hover:bg-white/10 transition-colors">
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-32 pt-20 border-t border-white/20 max-w-4xl mx-auto relative z-10">
        <h2 className="font-playfair text-3xl text-white mb-12 text-center">Customer Reviews</h2>

        <div className="grid md:grid-cols-12 gap-16 items-start">
            {/* Write Review */}
            <div className="md:col-span-4">
              {user ? (
                <form onSubmit={handleReviewSubmit} className="glass-card rounded-2xl border border-white/10 p-8">
                  <h3 className="font-playfair text-xl text-white mb-6">Share Your Thoughts</h3>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/20">
                    <label className="text-[10px] uppercase tracking-widest text-gray-300">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                          className={`text-lg transition ${star <= reviewForm.rating ? 'text-white' : 'text-gray-600'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <textarea rows={4} value={reviewForm.comment}
                    onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                    placeholder="Your experience with this piece..."
                    className="w-full bg-black/20 rounded-lg border border-white/20 p-4 text-sm text-white focus:outline-none focus:border-white resize-none mb-6 font-light placeholder-gray-500" />
                  {reviewMsg && <p className="text-[10px] uppercase tracking-widest text-white mb-4">{reviewMsg}</p>}
                  <button type="submit" disabled={submitting || !reviewForm.comment}
                    className="w-full font-semibold rounded-lg bg-white text-black text-[10px] uppercase tracking-[0.2em] py-3 hover:bg-gray-200 transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              ) : (
                 <div className="text-center p-8 rounded-2xl border border-white/20 glass-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">Please sign in to leave a review</p>
                    <button onClick={() => router.push('/login')} className="bg-transparent border border-white rounded-lg text-white font-semibold text-[10px] uppercase tracking-[0.2em] px-8 py-3 hover:bg-white hover:text-black transition-colors">Sign In</button>
                 </div>
              )}
            </div>

            {/* Read Reviews */}
            <div className="md:col-span-8 space-y-6">
              {reviews.length === 0 ? (
                <div className="py-12 border-b border-white/20">
                  <p className="text-sm font-light text-gray-400">No reviews yet. Be the first to share your experience with this piece.</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="pb-8 border-b border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-white font-semibold">{r.name}</span>
                      <span className="text-white text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">{r.comment}</p>
                    {r.createdAt && <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-4">{new Date(r.createdAt).toLocaleDateString()}</p>}
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
