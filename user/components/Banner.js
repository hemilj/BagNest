'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const bannerSlides = [
  {
    title: 'The Art of Elegance',
    subtitle: 'Meticulously crafted leather handbags for the refined wardrobe.',
    cta: 'Discover Handbags',
    href: '/products?category=Handbags',
    image: '/luxury_handbag.png',
  },
  {
    title: 'Modern Utility',
    subtitle: 'Sleek luxury backpacks merging high fashion with everyday function.',
    cta: 'Explore Backpacks',
    href: '/products?category=Backpacks',
    image: '/luxury_backpack.png',
  },
  {
    title: 'Journey Unbound',
    subtitle: 'Elevate your travel experience with our premium designer duffles.',
    cta: 'Shop Collection',
    href: '/products?category=Travel Bags',
    image: '/luxury_travel_bag.png',
  },
];

export default function Banner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % bannerSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden bg-transparent text-white">
      {bannerSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill 
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="opacity-70 mix-blend-overlay"
              priority={i === 0}
            />
            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
            <div className="max-w-xl">
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-300 mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Heritage Collection
              </span>
              <h1 className="font-playfair text-5xl md:text-7xl font-normal leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 font-light mb-10 max-w-sm leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                {slide.subtitle}
              </p>
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                <Link
                  href={slide.href}
                  className="inline-block border border-white/50 bg-white/5 backdrop-blur-sm text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-500"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Controls */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-6">
        <div className="text-xs font-light tracking-[0.2em] text-white/70">
          0{active + 1}
        </div>
        <div className="flex gap-3">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-[1px] transition-all duration-500 relative group overflow-hidden ${
                i === active ? 'w-16 bg-white' : 'w-8 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === active && (
                <div className="absolute inset-0 bg-white origin-left motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
              )}
            </button>
          ))}
        </div>
        <div className="text-xs font-light tracking-[0.2em] text-white/50">
          0{bannerSlides.length}
        </div>
      </div>
    </div>
  );
}
