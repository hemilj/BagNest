'use client';
import { useEffect, useState } from 'react';
import API from '../../../lib/axios';
import StatCard from '../../../components/StatCard';
import Topbar from '../../../components/Topbar';

const STATUS_COLORS = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-indigo-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordStats, uStats, prodRes] = await Promise.all([
          API.get('/orders/stats'),
          API.get('/users/stats'),
          API.get('/products?limit=1'),
        ]);
        setStats(ordStats.data);
        setUserStats(uStats.data);
        setProductCount(prodRes.data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalOrders = stats?.totalOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const statusBreakdown = stats?.statusBreakdown || [];
  const monthlyRevenue = stats?.monthlyRevenue || [];

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="Excl. cancelled" color="amber" />
              <StatCard icon="📦" label="Total Orders" value={totalOrders} sub="All time" color="blue" />
              <StatCard icon="👥" label="Total Users" value={userStats?.totalUsers || 0} sub={`+${userStats?.newUsersThisMonth || 0} this month`} color="green" />
              <StatCard icon="👜" label="Total Products" value={productCount} sub="In catalog" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Status Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">Order Status Breakdown</h2>
                <div className="space-y-4">
                  {statusBreakdown.map((s) => {
                    const pct = totalOrders > 0 ? Math.round((s.count / totalOrders) * 100) : 0;
                    return (
                      <div key={s._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 font-medium">{s._id}</span>
                          <span className="text-slate-500">{s.count} orders ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${STATUS_COLORS[s._id] || 'bg-slate-600'}`}
                            style={{ width: `${pct}%`, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                  {statusBreakdown.length === 0 && <p className="text-slate-500 text-center py-4">No order data yet</p>}
                </div>
              </div>

              {/* Monthly Revenue */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">Monthly Revenue</h2>
                {monthlyRevenue.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No revenue data yet</p>
                ) : (
                  <div className="space-y-3">
                    {monthlyRevenue.map((m) => {
                      const maxRev = Math.max(...monthlyRevenue.map((x) => x.revenue));
                      const pct = maxRev > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
                      const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      return (
                        <div key={`${m._id.year}-${m._id.month}`}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">{months[m._id.month]} {m._id.year}</span>
                            <span className="text-amber-400 font-semibold">₹{m.revenue.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                              style={{ width: `${pct}%`, transition: 'width 1s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/products/new', label: 'Add Product', icon: '➕', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                { href: '/orders', label: 'View Orders', icon: '📦', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
                { href: '/users', label: 'Manage Users', icon: '👥', color: 'bg-green-500/10 border-green-500/20 text-green-400' },
                { href: '/products', label: 'Manage Products', icon: '👜', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
              ].map((link) => (
                <a key={link.href} href={link.href}
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${link.color} hover:scale-[1.02] transition`}>
                  <span className="text-2xl">{link.icon}</span>
                  <span className="font-semibold text-sm">{link.label}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
