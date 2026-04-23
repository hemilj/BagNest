import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-md text-gray-400 border-t border-white/10 line-height-relaxed">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Brand */}
        <div className="md:col-span-4 lg:col-span-5">
          <Link href="/" className="inline-block mb-6">
            <span className="font-playfair text-white text-3xl tracking-wide">BagNest</span>
          </Link>
          <p className="text-sm font-light leading-relaxed max-w-sm mb-8 text-gray-400">
            Curating the finest leather goods and accessories for the modern individual. Experience uncompromising quality and timeless elegance.
          </p>
          <div className="flex gap-6 items-center">
            {['Instagram', 'Twitter', 'Facebook'].map((platform) => (
              <span key={platform} className="text-xs uppercase tracking-widest text-white hover:text-gray-400 transition-colors cursor-pointer">
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="text-white text-[10px] uppercase tracking-[0.2em] font-semibold mb-6">Shop</h4>
          <ul className="space-y-4">
            {['Handbags', 'Backpacks', 'Wallets', 'Travel Bags', 'Clutches', 'Sling Bags'].map((c) => (
              <li key={c}>
                <Link href={`/products?category=${c}`} className="text-sm hover:text-white transition-colors block">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="text-white text-[10px] uppercase tracking-[0.2em] font-semibold mb-6">Service</h4>
          <ul className="space-y-4">
            {['Track Order', 'Returns & Exchange', 'Shipping Policy', 'Size Guide', 'FAQ'].map((item) => (
              <li key={item}><span className="text-sm hover:text-white transition-colors cursor-pointer block">{item}</span></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4 lg:col-span-3">
          <h4 className="text-white text-[10px] uppercase tracking-[0.2em] font-semibold mb-6">Client Care</h4>
          <ul className="space-y-4 text-sm font-light mb-8">
            <li><a href="mailto:support@bagnest.com" className="hover:text-white transition-colors">support@bagnest.com</a></li>
            <li>+91 98765 43210</li>
            <li>Mon–Sat: 9 AM – 6 PM</li>
          </ul>
          
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">Newsletter</h4>
            <div className="flex border-b border-gray-700 pb-2 focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 font-light" 
                suppressHydrationWarning
              />
              <button className="text-[10px] uppercase tracking-widest text-white hover:text-gray-400 pl-4 font-semibold transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs tracking-widest text-gray-400 font-light py-8 px-6 uppercase flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <span suppressHydrationWarning>© {new Date().getFullYear()} BagNest</span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
