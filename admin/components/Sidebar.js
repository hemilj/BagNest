'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Products', icon: '👜' },
  { href: '/orders', label: 'Orders', icon: '📦' },
  { href: '/users', label: 'Users', icon: '👥' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center shadow">
            <span className="text-slate-900 font-extrabold text-lg">B</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-lg leading-tight">BagNest</p>
            <p className="text-amber-400 text-xs font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                active
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t border-slate-800">
        {admin && (
          <div className="mb-3 px-2">
            <p className="text-white text-sm font-semibold truncate">{admin.name}</p>
            <p className="text-slate-500 text-xs truncate">{admin.email}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
