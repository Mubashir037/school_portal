import { useNavigate } from 'react-router-dom';
import FeatureTile from '../components/features';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const todayStamp = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* top bar */}
      <div className="sticky top-0 z-10 border-b border-[#E4DFD3] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#B8873D]/50 text-[#1B2333]">
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-[#B8873D]/40 font-display text-[11px] tracking-tight">
                AH
              </div>
            </div>
            <div className="leading-tight">
              <p className="font-body text-[14px] font-semibold text-[#1B2333]">Aqsa Portal</p>
              <p className="font-mono text-[9.5px] tracking-[0.14em] text-[#B7B2A4]">ADMINISTRATION</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden text-right leading-tight sm:block">
              <p className="font-body text-[13px] font-medium text-[#1B2333]">Administrator</p>
              <p className="font-mono text-[9.5px] tracking-[0.12em] text-[#B7B2A4]">{todayStamp}</p>
            </div>
            <button
              onClick={handleLogout}
              className="font-body rounded-md border border-[#E4DFD3] px-3.5 py-1.5 text-[13px] text-[#5B5954]
                         transition hover:border-[#1B2333]/20 hover:bg-[#1B2333] hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-5xl px-8 py-14">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#B8873D] mb-3">OVERVIEW</p>
        <h1 className="font-display text-[30px] sm:text-[34px] font-medium text-[#1B2333] mb-1.5">
          {greeting}.
        </h1>
        <p className="font-body text-[14px] text-[#8B8A83] mb-12">
          Select a section below to get started.
        </p>

        <div className="mb-4 flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#8B8A83]">MODULES</p>
          <div className="h-px flex-1 bg-[#E4DFD3]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureTile
            to="/Students"
            title="Student information"
            description="View, add, edit, and search student records"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />

          <FeatureTile
            to="/fees"
            comingSoon
            title="Fee management"
            description="Record payments and generate receipts"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
          />

          <FeatureTile
            to="/issue-certificate"
            title="Result cards and certificates"
            description="Generate documents by GR No from templates"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                <circle cx="12" cy="8" r="6" />
                <path d="M9 14.5 7.5 22 12 19.5 16.5 22 15 14.5" />
              </svg>
            }
          />

          <FeatureTile
            to="/analytics"
            comingSoon
            title="Analytics"
            description="Enrollment and fee trends overview"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1B2333" strokeWidth="1.7" className="w-4.5 h-4.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            }
          />
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-[#E4DFD3] pt-6">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4]">
            AQSA HIGHER SECONDARY SCHOOL
          </p>
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#B7B2A4]">
            ADMINISTRATION PORTAL
          </p>
        </div>
      </div>
    </div>
  );
}