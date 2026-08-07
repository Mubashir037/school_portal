import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [em, setEm] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ em, pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Could not reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FBF9F5]">
      {/* Fonts: add these to your index.html <head> for production use
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* LEFT — ledger panel */}
      <div className="relative lg:w-1/2 min-h-[320px] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#16223A] px-10 py-12 sm:px-16 sm:py-16">
        {/* ruled ledger lines, faint */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 43px, #D9AE6C 44px)',
          }}
        />
        {/* margin rule, like a ledger page */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-[64px] hidden w-px bg-[#D9AE6C]/[0.12] sm:block" />

        {/* seal + wordmark */}
        <div className="relative flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D9AE6C]/50 text-[#E9CC98]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9AE6C]/40 font-display text-[13px] tracking-tight">
              AH
            </div>
          </div>
          <div className="leading-tight">
            <p className="font-body text-[14px] font-medium text-[#F3EFE6]">
              Aqsa Higher Secondary School
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#8D97AE]">
              EST. REGISTRY &amp; RECORDS
            </p>
          </div>
        </div>

        {/* headline */}
        <div className="relative flex-1 max-w-md py-14 lg:py-0 flex flex-col justify-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#D9AE6C] mb-5">
            01 — ADMIN ACCESS
          </p>
          <h1 className="font-display text-[36px] sm:text-[44px] font-medium leading-[1.12] tracking-tight text-[#F6F2E9] mb-6">
            Every record, every receipt, kept in good order.
          </h1>
          <p className="font-body text-[15px] leading-relaxed text-[#AEB6C7]">
            Student files, fee collection and certificates, entered once
            and trusted from then on. This portal is the school's ledger —
            sign in to keep it current.
          </p>
        </div>

        {/* footer */}
        <div className="relative border-t border-[#D9AE6C]/[0.15] pt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#8D97AE]">
            ADMINISTRATION PORTAL
          </p>
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#8D97AE]">
            STAFF ONLY
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-14 sm:px-16">
        <div className="w-full max-w-[360px]">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#B8873D] mb-3">
            WELCOME BACK
          </p>
          <h2 className="font-display text-[26px] font-medium text-[#1B2333] mb-1.5">
            Sign in
          </h2>
          <p className="font-body text-[14px] text-[#8B8A83] mb-9">
            Enter your admin credentials to continue
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                role="alert"
                className="font-body flex items-start gap-2.5 rounded-md border border-[#EDE0C4] bg-[#FBF6EC] px-3.5 py-2.5 text-[13px] text-[#8A6D2F] mb-6"
              >
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8873D]" />
                {error}
              </div>
            )}

            <label
              htmlFor="email"
              className="font-body block text-[13px] font-medium text-[#1B2333] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={em}
              onChange={(e) => setEm(e.target.value)}
              required
              placeholder="admin@aqsaschool.edu.pk"
              className="font-body w-full rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 text-[14px]
                         text-[#1B2333] placeholder:text-[#B7B2A4]
                         transition focus:border-[#B8873D] focus:bg-white focus:outline-none
                         focus:ring-2 focus:ring-[#B8873D]/20 mb-5"
            />

            <label
              htmlFor="password"
              className="font-body block text-[13px] font-medium text-[#1B2333] mb-1.5"
            >
              Password
            </label>
            <div className="relative mb-2">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                placeholder="Enter your password"
                className="font-body w-full rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 pr-10 text-[14px]
                           text-[#1B2333] placeholder:text-[#B7B2A4]
                           transition focus:border-[#B8873D] focus:bg-white focus:outline-none
                           focus:ring-2 focus:ring-[#B8873D]/20"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B7B2A4] transition hover:text-[#5B5954]"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.7 18.7 0 0 1 4.22-5.44M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-4 mb-7 flex items-center justify-between">
              <label className="font-body flex cursor-pointer items-center gap-2 text-[13px] text-[#5B5954]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#DEDBD5] text-[#B8873D] focus:ring-[#B8873D]/30"
                />
                Remember me
              </label>
              <a href="#" className="font-body text-[13px] text-[#5B5954] transition hover:text-[#1B2333] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-body relative w-full overflow-hidden rounded-md bg-[#1B2333] py-2.75 text-[14px] font-medium text-white
                         transition hover:bg-[#0F1930] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ paddingTop: '0.7rem', paddingBottom: '0.7rem' }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {loading && (
                  <svg className="h-3.5 w-3.5 animate-spin text-[#D9AE6C]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Z" />
                  </svg>
                )}
                {loading ? 'Signing in…' : 'Sign in'}
              </span>
            </button>
          </form>

          <p className="font-body mt-8 text-center text-[13px] text-[#5B5954]">
            New admin?{' '}
            <Link to="/register" className="font-medium text-[#1B2333] hover:underline">
              Create an account
            </Link>
          </p>

          <p className="font-mono mt-6 text-center text-[10px] tracking-[0.1em] text-[#B7B2A4]">
            © {new Date().getFullYear()} AQSA HIGHER SECONDARY SCHOOL — ACCESS RESTRICTED TO AUTHORIZED STAFF
          </p>
        </div>
      </div>
    </div>
  );
}