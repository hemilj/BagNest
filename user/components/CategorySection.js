import Link from 'next/link';

const categories = [
  { name: 'Handbags', desc: 'Everyday elegance' },
  { name: 'Backpacks', desc: 'Modern utility' },
  { name: 'Wallets', desc: 'Refined essentials' },
  { name: 'Travel Bags', desc: 'Journey in style' },
  { name: 'Clutches', desc: 'Evening sophistication' },
  { name: 'Sling Bags', desc: 'Effortless movement' },
  { name: 'Tote Bags', desc: 'Spacious luxury' },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-transparent relative z-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/20 pb-6 max-w-7xl mx-auto">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3 block">Curated Selection</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white font-normal">
              Shop by Category
            </h2>
          </div>
          <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-white hover:text-gray-300 transition-colors mt-4 md:mt-0 pb-1 border-b border-white hover:border-gray-300">
            Explore All Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px glass-card max-w-7xl mx-auto rounded-2xl overflow-hidden divide-x divide-y divide-white/10 text-white">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group flex flex-col items-center justify-center gap-3 py-10 px-4 hover:bg-white/10 transition-colors duration-500 border-white/10"
            >
              <span className="font-playfair text-xl text-white text-center group-hover:-translate-y-1 transition-transform duration-300">{cat.name}</span>
              <span className="text-[9px] uppercase tracking-[0.1em] text-gray-300 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
