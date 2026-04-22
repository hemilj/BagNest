'use client';
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const STATUS_COLORS = {
  Pending: 'bg-black/30 text-gray-300 border border-white/20',
  Processing: 'bg-white/10 text-white border border-white/20',
  Shipped: 'bg-white/20 text-white border border-white/30',
  Delivered: 'bg-white text-black',
  Cancelled: 'bg-red-500/20 text-red-200 border border-red-500/30',
};

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', city: '', state: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const orderSuccess = searchParams.get('success');

  useEffect(() => { if (!user) router.push('/login'); }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'addresses') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch { }
    finally { setOrdersLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/users/profile', form);
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch { setSaveMsg('Failed to update.'); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10 text-white">
      <div className="flex flex-col md:flex-row glass-card border border-white/20 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
        {/* Sidebar */}
        <div className="md:w-1/4 shrink-0 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
          <h1 className="font-playfair text-3xl text-white mb-8">My Account</h1>

          <div className="flex flex-col gap-4 border-b border-white/10 pb-8 mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Welcome</p>
            <p className="font-playfair text-xl text-white">{user.name}</p>
            <p className="text-sm font-light text-gray-300">{user.email}</p>
            <span className="text-[9px] uppercase tracking-[0.2em] bg-white text-black font-semibold px-3 py-1 inline-block w-max rounded-sm mt-2">
              {user.role === 'admin' ? 'Administrator' : 'Client'}
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {[['profile', 'Personal Information'], ['addresses', 'Saved Addresses'], ['orders', 'Order History']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`text-left text-[10px] uppercase tracking-[0.2em] py-3 transition-colors ${activeTab === key ? 'text-white font-semibold' : 'text-gray-500 hover:text-white'}`}>
                {label}
              </button>
            ))}
            <button onClick={() => { logout(); router.push('/'); }}
              className="text-left text-[10px] uppercase tracking-[0.2em] text-red-400 hover:text-red-300 py-3 transition-colors mt-4">
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 lg:p-12">
          {orderSuccess && (
            <div className="mb-10 p-6 glass-card border border-white/20 rounded-2xl">
              <h3 className="font-playfair text-xl text-white mb-2">Order Confirmed</h3>
              <p className="text-sm font-light text-gray-300">Your purchase (Reference: {orderSuccess}) is complete. Thank you for shopping with BagNest.</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="font-playfair text-2xl text-white mb-8 border-b border-white/20 pb-4">Personal Information</h2>
              <form onSubmit={handleSave} className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Full Name', name: 'name' },
                    { label: 'Email Address', name: 'email', disabled: true, value: user.email },
                    { label: 'Phone Number', name: 'phone' },
                    { label: 'City', name: 'city' },
                    { label: 'State / Province', name: 'state' },
                  ].map((f) => (
                    <div key={f.name} className={f.name === 'email' ? 'md:col-span-2' : ''}>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">{f.label}</label>
                      <input type="text" value={f.value !== undefined ? f.value : form[f.name]}
                        onChange={(e) => !f.disabled && setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                        disabled={f.disabled}
                        className="w-full border-b border-white/20 bg-transparent px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors disabled:text-gray-500" />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center gap-6">
                  <button type="submit" disabled={saving} className="bg-white text-black font-semibold rounded-lg text-[10px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-gray-200 transition-colors disabled:opacity-50">
                    {saving ? 'Updating...' : 'Save Changes'}
                  </button>
                  {saveMsg && <span className="text-[10px] uppercase tracking-widest text-white">{saveMsg}</span>}
                </div>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="animate-fade-in">
              <h2 className="font-playfair text-2xl text-white mb-8 border-b border-white/20 pb-4">Saved Addresses</h2>
              {ordersLoading ? (
                <div className="py-12 text-gray-400 text-sm font-light">Retrieving your addresses...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(() => {
                    const addressMap = new Map();
                    orders.forEach(order => {
                      if (order.shippingAddress) {
                        const addr = order.shippingAddress;
                        const key = `${addr.street}-${addr.city}-${addr.state}-${addr.pincode}`.toLowerCase();
                        if (!addressMap.has(key)) addressMap.set(key, addr);
                      }
                    });
                    const addresses = Array.from(addressMap.values());
                    
                    if (addresses.length === 0) {
                      return (
                        <div className="col-span-full py-16 text-center glass-card border border-white/20 rounded-2xl">
                          <p className="font-playfair text-xl text-white mb-2">No Saved Addresses</p>
                          <p className="text-gray-400 text-sm font-light">Your delivery addresses will be automatically saved here once you successfully place your first order.</p>
                        </div>
                      );
                    }

                    return addresses.map((addr, i) => (
                      <div key={i} className="glass-card border border-white/10 bg-black/20 rounded-2xl p-6 lg:p-8 hover:border-white/30 transition-colors">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                           <p className="font-semibold text-white tracking-wide">{addr.name}</p>
                           <p className="text-xs font-light text-gray-300">{addr.phone}</p>
                        </div>
                        <p className="text-sm font-light text-gray-400 leading-relaxed">{addr.street}</p>
                        <p className="text-sm font-light text-gray-400 leading-relaxed">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="font-playfair text-2xl text-white mb-8 border-b border-white/20 pb-4">Order History</h2>
              {ordersLoading ? (
                <div className="py-12 text-gray-400 text-sm font-light">Retrieving your orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center glass-card border border-white/20 rounded-2xl">
                  <p className="font-playfair text-xl text-white mb-4">No Previous Orders</p>
                  <Link href="/products" className="inline-block border-white text-black bg-white rounded-lg px-8 font-semibold py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-white transition-colors">
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order._id} className="glass-card border border-white/10 rounded-2xl p-6 lg:p-8 hover:border-white/30 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-white/10 pb-6">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">Order Reference</p>
                          <p className="font-playfair text-lg text-white">{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                          <div className="text-right">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-white font-medium">₹{order.totalPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 pr-6 border-r border-white/20 last:border-0 last:pr-0">
                            <span className="text-sm font-light text-white">{item.name}</span>
                            <span className="text-[10px] text-gray-400">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-32 text-[#555555] font-light">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
