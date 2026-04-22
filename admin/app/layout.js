import { Inter } from 'next/font/google';
import './globals.css';
import { AdminAuthProvider } from '../context/AdminAuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BagNest Admin Dashboard',
  description: 'Admin panel for BagNest e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 min-h-screen`}>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
