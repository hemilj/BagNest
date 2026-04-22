export default function StatCard({ icon, label, value, sub, color = 'amber' }) {
  const colors = {
    amber: 'from-amber-500 to-yellow-500',
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-violet-500',
    red: 'from-red-500 to-rose-500',
  };
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-5 hover:border-slate-600 transition">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-2xl font-extrabold mt-0.5">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
