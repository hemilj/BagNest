'use client';
import { useState } from 'react';
import API from '../lib/axios';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Handbags', 'Backpacks', 'Tote Bags', 'Wallets', 'Clutches', 'Sling Bags', 'Travel Bags'];

export default function ProductForm({ initial = null }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    originalPrice: initial?.originalPrice || '',
    category: initial?.category || 'Handbags',
    stock: initial?.stock || '',
    brand: initial?.brand || 'BagNest',
    color: initial?.color || '',
    material: initial?.material || '',
    isFeatured: initial?.isFeatured || false,
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (images) Array.from(images).forEach((f) => fd.append('images', f));

      if (isEdit) {
        await API.put(`/products/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      router.push('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition placeholder-slate-500';
  const label = 'text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wide';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={label}>Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Luxe Leather Tote" className={input} required />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            placeholder="Describe the product..." className={input + ' resize-none'} required />
        </div>
        <div>
          <label className={label}>Price (₹) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="1999" className={input} required min={0} />
        </div>
        <div>
          <label className={label}>Original Price (₹)</label>
          <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="2999" className={input} min={0} />
        </div>
        <div>
          <label className={label}>Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={input}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Stock *</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" className={input} required min={0} />
        </div>
        <div>
          <label className={label}>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="BagNest" className={input} />
        </div>
        <div>
          <label className={label}>Color</label>
          <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Cognac Brown" className={input} />
        </div>
        <div>
          <label className={label}>Material</label>
          <input name="material" value={form.material} onChange={handleChange} placeholder="e.g. Genuine Leather" className={input} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
            className="w-5 h-5 accent-amber-500 rounded" />
          <label htmlFor="isFeatured" className="text-slate-300 text-sm font-medium cursor-pointer">Mark as Featured Product</label>
        </div>
        <div className="md:col-span-2">
          <label className={label}>Product Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)}
            className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-slate-900 hover:file:bg-amber-400 cursor-pointer" />
          {isEdit && initial.images?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {initial.images.map((img, i) => (
                <img key={i} src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${img}`}
                  alt="" className="w-14 h-14 object-cover rounded-lg border border-slate-700" />
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.push('/products')}
          className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-800 font-semibold py-3 rounded-xl transition">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition disabled:opacity-50">
          {loading ? 'Saving...' : isEdit ? '✓ Update Product' : '+ Add Product'}
        </button>
      </div>
    </form>
  );
}
