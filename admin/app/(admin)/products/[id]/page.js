'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '../../../../lib/axios';
import ProductForm from '../../../../components/ProductForm';
import Topbar from '../../../../components/Topbar';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div>
      <Topbar title="Edit Product" />
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div>
      <Topbar title={`Edit: ${product?.name || 'Product'}`} />
      <div className="p-6 max-w-4xl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6">Edit Product Details</h2>
          {product && <ProductForm initial={product} />}
        </div>
      </div>
    </div>
  );
}
