'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';

const CATEGORIES = ['All', 'Handbags', 'Backpacks', 'Tote Bags', 'Wallets', 'Clutches', 'Sling Bags', 'Travel Bags'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', filters.featured);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: 'All', minPrice: '', maxPrice: '', minRating: '', search: '', featured: '' });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white relative z-10">
      <div className="border-b border-white/20 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 block">Our Collection</span>
          <h1 className="font-playfair text-3xl md:text-4xl text-white font-normal">
            {filters.category !== 'All' ? filters.category : 'All Bags'}
          </h1>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase mt-4 md:mt-0">
          Showing {total} {total === 1 ? 'result' : 'results'}
        </span>
      </div>

      <div className="flex gap-10">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8 glass-card p-6 h-fit rounded-2xl">
          <div className="sticky top-28">
            <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Refine By</h3>
              <button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-colors">Reset All</button>
            </div>

            {/* Category */}
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-5">Category</p>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" className="appearance-none w-3 h-3 border border-white/30 bg-transparent rounded-none checked:bg-white checked:border-white transition-colors"
                      checked={filters.category === cat}
                      onChange={() => handleFilterChange('category', cat)} />
                    <span className={`text-xs transition-colors ${filters.category === cat ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-5">Price Focus</p>
              <div className="flex gap-4">
                <input type="number" placeholder="Min" value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-1/2 border-b border-white/20 bg-transparent px-1 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" />
                <input type="number" placeholder="Max" value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-1/2 border-b border-white/20 bg-transparent px-1 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-5">Client Rating</p>
              <div className="space-y-4">
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="rating" className="appearance-none w-3 h-3 border border-white/30 rounded-none checked:bg-white checked:border-white transition-colors"
                      checked={filters.minRating === String(r)}
                      onChange={() => handleFilterChange('minRating', String(r))} />
                    <span className="text-white text-[10px]">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">& up</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="py-20 text-center"><Loader text="Curating items..." /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 glass-card rounded-2xl">
              <p className="text-xl font-playfair text-white mb-3">No items discovered</p>
              <p className="text-gray-400 text-sm font-light mb-8 max-w-sm mx-auto">Please adjust your current selection to find what you're looking for.</p>
              <button onClick={clearFilters} className="px-8 py-3 border border-white text-black bg-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-transparent hover:text-white transition-colors duration-300 rounded-lg">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-white/10">
                  <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
                    className="text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-30 hover:opacity-70 transition-opacity">
                    Prev
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center text-xs transition-all duration-300 border rounded-full ${p === page ? 'bg-white text-black border-white' : 'text-gray-400 border-transparent hover:border-white/20'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPage((p) => Math.min(p + 1, pages))} disabled={page === pages}
                    className="text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-30 hover:opacity-70 transition-opacity">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-32"><Loader text="Loading collection..." /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
