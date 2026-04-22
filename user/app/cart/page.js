'use client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-6 relative z-10 text-white">
        <div className="max-w-md mx-auto text-center border border-white/20 p-14 glass-card rounded-3xl">
          <h2 className="text-2xl font-playfair text-white mb-2">Authentication Required</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Please sign in to view your bag</p>
          <Link href="/login" className="block w-full bg-white border border-white text-black rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-transparent hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="py-32 text-center"><Loader text="Curating your selection..." /></div>;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-6 relative z-10 text-white">
        <div className="max-w-md mx-auto text-center border border-white/20 p-14 glass-card rounded-3xl">
          <h2 className="text-2xl font-playfair text-white mb-2">Your Bag is Empty</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Discover our latest collection</p>
          <Link href="/products" className="block w-full bg-white border border-white text-black rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-transparent hover:text-white transition-colors">
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-white">
      <div className="border-b border-white/20 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 block">Shopping Bag</span>
          <h1 className="font-playfair text-3xl md:text-4xl text-white font-normal">
            Review Your Selection
          </h1>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-white uppercase mt-4 md:mt-0">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Item List */}
        <div className="flex-1 space-y-6">
          {/* Header row for list */}
          <div className="hidden md:flex justify-between items-center text-[9px] uppercase tracking-[0.2em] text-gray-300 border-b border-white/20 pb-3 px-2">
            <span className="w-2/3">Product</span>
            <span className="w-1/6 text-center">Quantity</span>
            <span className="w-1/6 text-right">Total</span>
          </div>

          {cartItems.map((item) => {
            const p = item.product;
            if (!p) return null;
            const imageUrl = p.images?.[0]?.startsWith('http') ? p.images[0] : `${API_BASE}${p.images?.[0] || ''}`;
            return (
              <div key={item._id} className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-white/20 gap-6">
                <Link href={`/products/${p._id}`} className="shrink-0 w-32 h-32 glass-card rounded-2xl overflow-hidden p-2">
                  <img src={imageUrl} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                </Link>

                <div className="flex-1 md:w-2/3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{p.category}</p>
                  <Link href={`/products/${p._id}`}>
                    <h3 className="font-playfair text-lg text-white mb-2">{p.name}</h3>
                  </Link>
                  <p className="text-gray-300 text-xs">₹{p.price?.toLocaleString()}</p>
                  
                  <button onClick={() => removeFromCart(p._id)}
                      className="mt-4 text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 inline-block">
                      Remove Product
                  </button>
                </div>

                <div className="md:w-1/6 flex justify-start md:justify-center w-full mt-4 md:mt-0">
                  <div className="flex items-center border border-white/30 rounded-lg overflow-hidden">
                    <button onClick={() => addToCart(p._id, Math.max(1, item.qty - 1))}
                      className="px-3 py-1.5 text-white hover:bg-white/10 transition-colors text-xs">−</button>
                    <span className="px-4 py-1.5 font-medium text-xs text-white">{item.qty}</span>
                    <button onClick={() => addToCart(p._id, Math.min(p.stock, item.qty + 1))}
                      className="px-3 py-1.5 text-white hover:bg-white/10 transition-colors text-xs">+</button>
                  </div>
                </div>

                <div className="md:w-1/6 text-left md:text-right w-full mt-2 md:mt-0">
                  <p className="text-sm text-white font-medium">₹{(p.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 shrink-0 mt-8 lg:mt-0">
          <div className="glass-card rounded-3xl p-8 border border-white/10 sticky top-28">
            <h2 className="font-playfair text-xl text-white mb-8 border-b border-white/20 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-300 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest">Subtotal</span>
                <span className="text-white">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest">Shipping</span>
                <span className={shipping === 0 ? 'text-white uppercase tracking-[0.2em] text-[10px]' : 'text-white'}>
                  {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                </span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 border border-white/20 rounded-md p-3 text-center mb-6">
                Add ₹{999 - cartTotal} more for complimentary shipping
              </p>
            )}

            <div className="flex justify-between items-center text-lg text-white border-t border-white/20 pt-6 mb-8 mt-6">
              <span className="font-playfair">Estimated Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button onClick={() => router.push('/checkout')}
              className="w-full bg-white border border-white text-black font-semibold rounded-lg text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-transparent hover:text-white transition-colors">
              Proceed to Checkout
            </button>
            <Link href="/products" className="block text-center mt-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 w-max mx-auto">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
