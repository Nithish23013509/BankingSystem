import { useEffect } from 'react';
import { getAllUsers } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Card from '../components/common/Card';

export default function UsersPage() {
  const { data: users, loading, execute } = useApi(getAllUsers);

  useEffect(() => { execute(); }, [execute]);

  const list = users || [];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Users</h2>
          <p className="text-slate-500 text-sm mt-1">View all registered users and administrators</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden" glow>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['User ID', 'Email', 'Role'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 text-sm">Loading users...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500 text-sm">No users found</td></tr>
              ) : (
                list.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="hover:bg-white/[0.03] transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {u.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400/20 to-sky-400/20 border border-white/10 flex items-center justify-center text-xs font-bold text-violet-400">
                          {(u.email || 'U')[0].toUpperCase()}
                        </div>
                        <span className="text-slate-200 font-medium">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'}`}>
                        {u.role || 'USER'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
