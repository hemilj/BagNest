'use client';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Topbar({ title }) {
  const { admin } = useAdminAuth();
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-white font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-semibold">{admin?.name}</p>
          <p className="text-slate-400 text-xs">Administrator</p>
        </div>
        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 font-extrabold">
          {admin?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
