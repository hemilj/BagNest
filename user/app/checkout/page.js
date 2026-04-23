'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        setAddressLoading(true);
        try {
          const { data } = await API.get('/orders/my');
          const addressMap = new Map();
          data.forEach(order => {
            if (order.shippingAddress) {
              const addr = order.shippingAddress;
              const key = `${addr.street}-${addr.city}-${addr.state}-${addr.pincode}`.toLowerCase();
              if (!addressMap.has(key)) addressMap.set(key, addr);
            }
          });
          setSavedAddresses(Array.from(addressMap.values()));
        } catch (err) { }
        finally { setAddressLoading(false); }
      };
      fetchAddresses();
    }
  }, [user]);

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const items = cartItems.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
        image: i.product.images?.[0] || '',
      }));

      const orderData = {
        items,
        shippingAddress: form,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
      };

      if (paymentMethod === 'Online') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: "INR",
          name: "BagNest Store",
          description: "Bag Purchase",
          handler: async (response) => {
            try {
              const { data } = await API.post('/orders', {
                ...orderData,
                isPaid: true,
                paidAt: new Date(),
              });
              await clearCart();
              router.push(`/profile?tab=orders&success=${data._id}`);
            } catch (err) {
              setError(err.response?.data?.message || 'Order failed after payment. Please contact support.');
            } finally {
              setPlacing(false);
            }
          },
          prefill: {
            name: form.name,
            contact: form.phone,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: () => setPlacing(false),
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const { data } = await API.post('/orders', orderData);
        await clearCart();
        router.push(`/profile?tab=orders&success=${data._id}`);
        setPlacing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-24 glass-card mx-4 sm:mx-6 my-12 rounded-3xl relative z-10 border border-white/20">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-xl font-playfair font-normal text-white mb-6">Please login to checkout</h2>
        <Link href="/login" className="bg-white text-black border border-white px-8 py-3 rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-white transition-colors">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24 glass-card mx-4 sm:mx-6 my-12 rounded-3xl relative z-10 border border-white/20">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-playfair font-normal text-white mb-6">Your bag is empty</h2>
        <Link href="/products" className="bg-white text-black border border-white px-8 py-3 rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-white transition-colors">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 relative z-10 text-white">
      <h1 className="text-3xl md:text-4xl font-playfair font-normal text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10 text-[10px] uppercase tracking-[0.2em] font-semibold">
        {['Delivery', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${step > i + 1 ? 'bg-white text-black border-white' : step === i + 1 ? 'border-white text-white' : 'bg-black/20 border-white/20 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={step >= i + 1 ? 'text-white' : 'text-gray-500'}>{s}</span>
            {i < 2 && <div className="w-8 md:w-12 h-[1px] bg-white/20" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="font-playfair text-white text-xl mb-6">Delivery Address</h2>

              {savedAddresses.length > 0 && (
                <div className="mb-8 border-b border-white/10 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Select a saved address</p>
                    <button onClick={() => setForm({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' })} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-white underline transition-colors">Clear Selection</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr, i) => (
                      <div key={i} onClick={() => setForm(addr)}
                        className={`p-5 rounded-xl border cursor-pointer transition-colors duration-300 ${form.street === addr.street && form.pincode === addr.pincode ? 'border-white bg-white/10 shadow-lg shadow-white/5' : 'border-white/20 bg-black/20 hover:border-white/50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white tracking-wide text-sm">{addr.name}</p>
                          {form.street === addr.street && form.pincode === addr.pincode && <span className="text-white text-xs">✓</span>}
                        </div>
                        <p className="text-xs font-light text-gray-300 mb-1">{addr.phone}</p>
                        <p className="text-xs font-light text-gray-400 leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                {savedAddresses.length > 0 && <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Or enter a new address manually</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', name: 'name', placeholder: 'Your name' },
                    { label: 'Phone', name: 'phone', placeholder: '+91 XXXXX XXXXX' },
                    { label: 'Street Address', name: 'street', placeholder: 'House no, Street' },
                    { label: 'City', name: 'city', placeholder: 'City' },
                    { label: 'State', name: 'state', placeholder: 'State' },
                    { label: 'Pincode', name: 'pincode', placeholder: '560001' },
                  ].map((f) => (
                    <div key={f.name} className={f.name === 'street' ? 'sm:col-span-2' : ''}>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">{f.label}</label>
                      <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full border border-white/20 bg-black/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)}
                disabled={!form.name || !form.phone || !form.street || !form.city || !form.state || !form.pincode}
                className="mt-8 w-full bg-white text-black font-semibold text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="font-playfair text-white text-xl mb-6">Payment Method</h2>
              <div className="space-y-4">
                {[
                  { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'Online', label: 'Online Payment', desc: 'UPI, Card, Net Banking (Demo)' },
                ].map((method) => (
                  <label key={method.value}
                    className={`flex items-center gap-6 p-5 rounded-xl border border-white/20 cursor-pointer transition-colors duration-300 ${paymentMethod === method.value ? 'border-white bg-white/10' : 'hover:border-white/50 bg-black/20'}`}>
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)} className="accent-white" />
                    <div>
                      <p className="font-semibold text-white tracking-wide text-sm">{method.label}</p>
                      <p className="text-xs text-gray-400 font-light mt-1">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 border border-white text-white text-[10px] uppercase tracking-[0.2em] font-semibold py-4 rounded-xl hover:bg-white/10 transition-colors">
                  Go Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Place */}
          {step === 3 && (
            <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="font-playfair text-white text-xl mb-6">Review Your Order</h2>
              <div className="mb-6 p-5 bg-black/20 border border-white/10 rounded-xl text-sm space-y-2">
                <p className="font-semibold text-white tracking-widest uppercase text-[10px] mb-2">Delivering to:</p>
                <p className="text-gray-300 font-light">{form.name} • {form.phone}</p>
                <p className="text-gray-300 font-light">{form.street}, {form.city}, {form.state} - {form.pincode}</p>
              </div>
              <div className="mb-8 p-5 bg-black/20 border border-white/10 rounded-xl text-sm">
                <p className="font-semibold text-white tracking-widest uppercase text-[10px] mb-2">Payment Method:</p>
                <p className="text-gray-300 font-light">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
              </div>

              <div className="space-y-4 mb-4">
                {cartItems.map((i) => (
                  <div key={i._id} className="flex justify-between items-center text-sm py-4 border-b border-white/10">
                    <span className="text-gray-300 font-light">{i.product?.name} <span className="text-gray-500">× {i.qty}</span></span>
                    <span className="font-semibold text-white">₹{(i.product?.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-400 text-xs tracking-widest uppercase mb-4">{error}</p>}

              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                <button onClick={() => setStep(2)} className="flex-1 border border-white text-white text-[10px] uppercase tracking-[0.2em] font-semibold py-4 rounded-xl hover:bg-white/10 transition-colors">
                  Go Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl transition-colors disabled:opacity-50">
                  {placing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="glass-card rounded-2xl border border-white/10 p-6 sticky top-28">
            <h3 className="font-playfair text-white text-lg mb-6 border-b border-white/20 pb-4">Order Details</h3>
            <div className="space-y-3 mb-6 border-b border-white/20 pb-4">
              {cartItems.map((i) => i.product && (
                <div key={i._id} className="flex justify-between text-xs text-gray-400">
                  <span className="truncate pr-4">{i.product.name}</span>
                  <span className="shrink-0 text-white">×{i.qty}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-xs tracking-wider text-gray-400">
              <div className="flex justify-between items-center"><span className="uppercase text-[9px] tracking-widest">Subtotal</span><span className="text-white">₹{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="uppercase text-[9px] tracking-widest">Shipping</span><span className={shipping === 0 ? 'text-white' : 'text-white'}>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span></div>

              <div className="flex justify-between items-center font-playfair text-white text-lg pt-4 border-t border-white/20">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-8 text-center">Secure SSL Checkout</p>
          </div>
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
