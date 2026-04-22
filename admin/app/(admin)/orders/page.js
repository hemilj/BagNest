'use client';
import { useEffect, useState } from 'react';
import API from '../../../lib/axios';
import DataTable from '../../../components/DataTable';
import Topbar from '../../../components/Topbar';

const STATUS_COLORS = {
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/orders?page=${page}&limit=20`);
      setOrders(data.orders);
      setPages(data.pages);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } finally { setUpdating(null); }
  };

  const columns = [
    {
      key: '_id', label: 'Order ID',
      render: (id) => <span className="font-mono text-xs text-slate-400">#{id.slice(-8).toUpperCase()}</span>,
    },
    {
      key: 'user', label: 'Customer',
      render: (user) => (
        <div>
          <p className="text-slate-300 text-sm font-medium">{user?.name || 'N/A'}</p>
          <p className="text-slate-500 text-xs">{user?.email}</p>
        </div>
      ),
    },
    {
      key: 'items', label: 'Items',
      render: (items) => <span className="text-slate-400 text-sm">{items?.length} item(s)</span>,
    },
    {
      key: 'totalPrice', label: 'Total',
      render: (v) => <span className="font-bold text-amber-400">₹{v?.toLocaleString()}</span>,
    },
    {
      key: 'paymentMethod', label: 'Payment',
      render: (v) => <span className="text-slate-400 text-sm">{v}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (status, row) => (
        <select
          value={status}
          disabled={updating === row._id}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1 rounded-lg border bg-transparent ${STATUS_COLORS[status]} focus:outline-none cursor-pointer`}>
          {STATUSES.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
        </select>
      ),
    },
    {
      key: 'createdAt', label: 'Date',
      render: (v) => <span className="text-slate-500 text-xs">{new Date(v).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <Topbar title={`Orders (${total})`} />
      <div className="p-6">
        <p className="text-slate-400 text-sm mb-6">View and update customer order statuses</p>
        <DataTable columns={columns} data={orders} loading={loading} emptyMsg="No orders yet" />
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${p === page ? 'bg-amber-500 text-slate-900 border-amber-500' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
