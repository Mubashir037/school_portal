import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../api/Client';

function StatCard({ label, value, sub, icon }) {
  return (
    <div
      className="relative overflow-hidden rounded-md border p-6"
      style={{
        borderColor: '#E4DFD3',
        backgroundColor: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow: '0 8px 22px -14px rgba(27,35,51,0.18)'
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4] mb-2">{label}</p>
          <p className="font-display text-[28px] font-medium text-[#1B2333] leading-none">{value}</p>
          {sub && <p className="mt-2 font-body text-[12px] text-[#8B8A83]">{sub}</p>}
        </div>
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B8873D]/40">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .get()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const todayStamp = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();

  const maxClassCount = data?.classDistribution?.length
    ? Math.max(...data.classDistribution.map((c) => c.count))
    : 1;

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* top bar — mirrors dashboard */}
      <div className="sticky top-0 z-10 border-b border-[#E4DFD3] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-body text-[13px] text-[#5B5954] hover:text-[#1B2333] transition"
          >
            &larr; Dashboard
          </button>
          <div className="text-right leading-tight">
            <p className="font-body text-[13px] font-medium text-[#1B2333]">Analytics</p>
            <p className="font-mono text-[9.5px] tracking-[0.12em] text-[#B7B2A4]">{todayStamp}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-14">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#B8873D] mb-3">OVERVIEW</p>
        <h1 className="font-display text-[30px] sm:text-[34px] font-medium text-[#1B2333] mb-1.5">
          School analytics.
        </h1>
        <p className="font-body text-[14px] text-[#8B8A83] mb-12">
          Live snapshot of enrollment and fee collection.
        </p>

        {loading && (
          <p className="font-body text-[14px] text-[#8B8A83]">Loading analytics&hellip;</p>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 font-body text-[13px] text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-4">
              <StatCard
                label="TOTAL STUDENTS"
                value={data.totalStudents}
                sub="Enrolled records"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />
              <StatCard
                label="FEE DUE REMAINING"
                value={`Rs ${data.totalDue.toLocaleString()}`}
                sub={`${data.unpaidCount} unpaid invoice${data.unpaidCount === 1 ? '' : 's'}`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                }
              />
              <StatCard
                label="FEE EARNED THIS MONTH"
                value={`Rs ${data.feeEarnedThisMonth.toLocaleString()}`}
                sub={`${data.paidCountThisMonth} payment${data.paidCountThisMonth === 1 ? '' : 's'} received`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                }
              />
              <StatCard
                label="TOTAL INCOME EARNED"
                value={`Rs ${data.totalIncomeAllTime.toLocaleString()}`}
                sub={`${data.paidCountAllTime} payment${data.paidCountAllTime === 1 ? '' : 's'} all-time`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
              />
            </div>

            {data.classDistribution?.length > 0 && (
              <div
                className="mt-6 rounded-md border p-6"
                style={{
                  borderColor: '#E4DFD3',
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)'
                }}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4] mb-5">
                  STUDENTS BY CLASS
                </p>
                <div className="space-y-3">
                  {data.classDistribution.map((c) => (
                    <div key={c.class} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 font-body text-[12.5px] text-[#5B5954]">
                        Class {c.class}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EFEAE0]">
                        <div
                          className="h-full rounded-full bg-[#B8873D]"
                          style={{ width: `${(c.count / maxClassCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right font-mono text-[11px] text-[#8B8A83]">
                        {c.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.duesByStudent?.length > 0 && (
              <div
                className="mt-6 rounded-md border p-6"
                style={{
                  borderColor: '#E4DFD3',
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)'
                }}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4] mb-5">
                  STUDENTS WITH REMAINING DUES &mdash; LOWEST TO HIGHEST
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E4DFD3]">
                        <th className="pb-2 pr-4 font-mono text-[10px] tracking-[0.1em] text-[#B7B2A4]">GR NO</th>
                        <th className="pb-2 pr-4 font-mono text-[10px] tracking-[0.1em] text-[#B7B2A4]">NAME</th>
                        <th className="pb-2 pr-4 font-mono text-[10px] tracking-[0.1em] text-[#B7B2A4]">CLASS</th>
                        <th className="pb-2 pr-4 font-mono text-[10px] tracking-[0.1em] text-[#B7B2A4]">MONTHS DUE</th>
                        <th className="pb-2 font-mono text-[10px] tracking-[0.1em] text-[#B7B2A4] text-right">TOTAL DUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.duesByStudent.map((s) => (
                        <tr key={s.grno} className="border-b border-[#EFEAE0] last:border-0">
                          <td className="py-2.5 pr-4 font-mono text-[12px] text-[#5B5954]">{s.grno}</td>
                          <td className="py-2.5 pr-4 font-body text-[13px] text-[#1B2333]">{s.name || '—'}</td>
                          <td className="py-2.5 pr-4 font-body text-[13px] text-[#5B5954]">{s.class || '—'}</td>
                          <td className="py-2.5 pr-4 font-body text-[12px] text-[#8B8A83]">
                            {s.monthsDue.map((m) => m.month).join(', ')}
                          </td>
                          <td className="py-2.5 text-right font-mono text-[13px] font-medium text-[#1B2333]">
                            Rs {s.totalDue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-16 flex items-center justify-between border-t border-[#E4DFD3] pt-6">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4]">
                AQSA HIGHER SECONDARY SCHOOL
              </p>
              <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4]">
                ADMINISTRATION PORTAL
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}