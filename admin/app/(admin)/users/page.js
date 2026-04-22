'use client';
import { useEffect, useState } from 'react';
import API from '../../../lib/axios';
import DataTable from '../../../components/DataTable';
import Topbar from '../../../components/Topbar';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/users?page=${page}&limit=20`);
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    setDeleting(id);
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } finally { setDeleting(null); }
  };

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
            {v?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-slate-300 font-medium">{v}</p>
            <p className="text-slate-500 text-xs">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role',
      render: (v) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${v === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
          {v === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
      ),
    },
    {
      key: 'phone', label: 'Phone',
      render: (v) => <span className="text-slate-400 text-sm">{v || '—'}</span>,
    },
    {
      key: 'createdAt', label: 'Joined',
      render: (v) => <span className="text-slate-500 text-xs">{new Date(v).toLocaleDateString()}</span>,
    },
    {
      key: '_id', label: 'Actions',
      render: (id, row) => row.role === 'admin' ? (
        <span className="text-slate-600 text-xs">Protected</span>
      ) : (
        <button onClick={() => handleDelete(id)} disabled={deleting === id}
          className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition disabled:opacity-50">
          {deleting === id ? '...' : 'Delete'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <Topbar title={`Users (${total})`} />
      <div className="p-6">
        <p className="text-slate-400 text-sm mb-6">View and manage registered customers</p>
        <DataTable columns={columns} data={users} loading={loading} emptyMsg="No users found" />
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${p === page ? 'bg-amber-500 text-slate-900 border-amber-500' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
