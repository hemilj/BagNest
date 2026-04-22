import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata = {
  title: 'BagNest — Premium Bags & accessories',
  description: 'Shop the finest collection of handbags, backpacks, wallets, clutches, travel bags and more at BagNest. Premium quality, luxury design.',
  keywords: 'bags, handbags, backpacks, luxury, premium travel bags, BagNest',
};

import LayoutWrapper from '../components/LayoutWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${playfair.variable} bg-mesh-gradient min-h-screen flex flex-col text-white`}>
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
