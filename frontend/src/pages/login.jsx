import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        body: JSON.stringify({ em, pass })
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* LEFT HALF — full height, edge to edge, off-white */}
      <div className="lg:w-1/2 bg-[#F2F0EF] flex flex-col justify-between px-10 py-12 sm:px-16 sm:py-16 min-h-[280px] lg:min-h-screen">
        {/* logo mark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2B2A28] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-4.5 h-4.5">
              <path d="M22 10 12 5 2 10l10 5 10-5Z" />
              <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-[#2B2A28] tracking-tight">
            Aqsa Higher Secondary School
          </span>
        </div>

        {/* headline + mission, vertically centered in remaining space */}
        <div className="flex-1 flex flex-col justify-center max-w-md py-16">
          <h1 className="text-[34px] sm:text-[40px] font-semibold text-[#201F1D] leading-[1.15] tracking-tight mb-6">
            Every record, every receipt, organized with care.
          </h1>
          <p className="text-[15px] text-[#5B5954] leading-relaxed">
            Our mission is quality education, supported by a portal that
            keeps student records, fee collection, and certificates
            accurate and easy to manage.
          </p>
        </div>

        {/* thin divider footer */}
        <div className="border-t border-[#DEDBD5] pt-6">
          <p className="text-xs text-[#8A877F] tracking-wide">
            ADMINISTRATION PORTAL
          </p>
        </div>
      </div>

      {/* RIGHT HALF — form, full height */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-14 sm:px-16">
        <div className="w-full max-w-[360px]">
          <h2 className="text-[22px] font-semibold text-[#201F1D] mb-1">
            Sign in
          </h2>
          <p className="text-sm text-[#8A877F] mb-9">
            Enter your admin credentials to continue
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#FBF6EC] border border-[#EDE0C4] text-[#8A6D2F] text-sm px-3.5 py-2.5 rounded-md mb-6">
                {error}
              </div>
            )}

            <label className="block text-[13px] font-medium text-[#2B2A28] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={em}
              onChange={(e) => setEm(e.target.value)}
              required
              placeholder="admin@aqsaschool.edu.pk"
              className="w-full border border-[#E4E1DA] rounded-md px-3.5 py-2.5 text-[14px] text-[#201F1D]
                         placeholder:text-[#B3AFA6] bg-[#FAF9F7]
                         focus:outline-none focus:ring-2 focus:ring-[#C7C2B6]/40 focus:border-[#B8B2A3] focus:bg-white
                         transition mb-5"
            />

            <label className="block text-[13px] font-medium text-[#2B2A28] mb-1.5">
              Password
            </label>
            <div className="relative mb-2">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-[#E4E1DA] rounded-md px-3.5 py-2.5 pr-10 text-[14px] text-[#201F1D]
                           placeholder:text-[#B3AFA6] bg-[#FAF9F7]
                           focus:outline-none focus:ring-2 focus:ring-[#C7C2B6]/40 focus:border-[#B8B2A3] focus:bg-white
                           transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B3AFA6] hover:text-[#5B5954]"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.7 18.7 0 0 1 4.22-5.44M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mb-7 mt-4">
              <label className="flex items-center gap-2 text-[13px] text-[#5B5954] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#DEDBD5] text-[#2B2A28] focus:ring-[#2B2A28]/20"
                />
                Remember me
              </label>
              <a href="#" className="text-[13px] text-[#5B5954] hover:text-[#2B2A28] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B2A28] text-white text-[14px] font-medium py-2.75 rounded-md
                         hover:bg-[#201F1D] disabled:opacity-50 disabled:cursor-not-allowed
                         transition"
              style={{ paddingTop: '0.68rem', paddingBottom: '0.68rem' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-[#B3AFA6] mt-10">
            © {new Date().getFullYear()} Aqsa Higher Secondary School — Access restricted to authorized staff.
          </p>
        </div>
      </div>
    </div>
  );
}