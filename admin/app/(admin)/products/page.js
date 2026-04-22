'use client';
import { useEffect, useState } from 'react';
import API from '../../../lib/axios';
import DataTable from '../../../components/DataTable';
import Topbar from '../../../components/Topbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/products?page=${page}&limit=15`);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } finally { setDeleting(null); }
  };

  const columns = [
    {
      key: 'images', label: 'Image',
      render: (images) => {
        const src = images?.[0]?.startsWith('http') ? images[0] : `${API_BASE}${images?.[0] || ''}`;
        return <img src={src} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-700" />;
      },
    },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'price', label: 'Price',
      render: (v) => <span className="font-semibold text-amber-400">₹{v?.toLocaleString()}</span>,
    },
    {
      key: 'stock', label: 'Stock',
      render: (v) => <span className={`font-semibold ${v === 0 ? 'text-red-400' : v < 10 ? 'text-orange-400' : 'text-green-400'}`}>{v}</span>,
    },
    {
      key: 'rating', label: 'Rating',
      render: (v) => <span className="text-yellow-400">★ {v?.toFixed(1) || '0.0'}</span>,
    },
    {
      key: '_id', label: 'Actions',
      render: (id) => (
        <div className="flex gap-2">
          <Link href={`/products/${id}`}
            className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold hover:bg-blue-500/20 transition">
            Edit
          </Link>
          <button onClick={() => handleDelete(id)} disabled={deleting === id}
            className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition disabled:opacity-50">
            {deleting === id ? '...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Topbar title={`Products (${total})`} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400 text-sm">Manage your product catalog</p>
          <Link href="/products/new"
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-transform hover:scale-105">
            + Add Product
          </Link>
        </div>

        <DataTable columns={columns} data={products} loading={loading} emptyMsg="No products found. Add your first product!" />

        {/* Pagination */}
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
