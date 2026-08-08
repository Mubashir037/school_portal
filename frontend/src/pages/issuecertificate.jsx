import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi, certificateApi } from '../api/client';

export default function IssueCertificate() {
  const [grno, setGrno] = useState('');
  const [student, setStudent] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [looking, setLooking] = useState(false);

  const [form, setForm] = useState({
    progress: '', date_of_leaving: '', class_at_leaving: '',
    reason_for_leaving: '', remarks: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [issued, setIssued] = useState(false);

  const navigate = useNavigate();

  const lookup = async () => {
    if (!grno) return;
    setLooking(true);
    setLookupError('');
    setStudent(null);
    setIssued(false);
    try {
      const data = await studentApi.getOne(grno);
      setStudent(data);
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLooking(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await certificateApi.issue({ grno, ...form });
      setIssued(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, type = 'text', extra = {}) => (
    <div>
      <label className="font-body block text-[13px] font-medium text-[#1B2333] mb-1.5">{label}</label>
      <input
        type={type} name={name} value={form[name]} onChange={handleChange} {...extra}
        className="font-body w-full rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 text-[14px]
                   placeholder:text-[#B7B2A4] transition focus:border-[#B8873D] focus:bg-white
                   focus:outline-none focus:ring-2 focus:ring-[#B8873D]/20"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      <div className="sticky top-0 z-10 border-b border-[#E4DFD3] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
          <button
            onClick={() => navigate('/students')}
            className="font-body flex items-center gap-1.5 text-[13px] text-[#8B8A83] transition hover:text-[#1B2333]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Students
          </button>
          <span className="font-body text-[13px] text-[#5B5954]">Administrator</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-10">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#B8873D] mb-2">CERTIFICATES</p>
        <h1 className="font-display text-[28px] font-medium text-[#1B2333] mb-1.5">
          Issue leaving certificate
        </h1>
        <p className="font-body text-[13.5px] text-[#8B8A83] mb-10">
          Enter a GR No to pull up the student, then fill in leaving details.
        </p>

        <div className="mb-8 flex gap-3">
          <input
            type="text" placeholder="Enter GR No…" value={grno}
            onChange={(e) => setGrno(e.target.value)}
            className="font-body w-full max-w-xs rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 text-[14px]
                       placeholder:text-[#B7B2A4] transition focus:border-[#B8873D] focus:bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#B8873D]/20"
          />
          <button
            onClick={lookup} disabled={!grno || looking}
            className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
                       transition hover:bg-[#0F1930] disabled:opacity-50"
          >
            {looking ? 'Looking up…' : 'Find student'}
          </button>
        </div>

        {lookupError && (
          <div role="alert" className="font-body mb-6 flex items-start gap-2.5 rounded-md border border-[#EDE0C4] bg-[#FBF6EC] px-4 py-3 text-[13px] text-[#8A6D2F]">
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8873D]" />
            {lookupError}
          </div>
        )}

        {student && !issued && (
          <>
            <div className="mb-8 rounded-lg border border-[#E4DFD3] bg-white px-6 py-5">
              <p className="font-mono text-[10px] tracking-[0.16em] text-[#B8873D] mb-2">STUDENT</p>
              <p className="font-display text-[18px] text-[#1B2333]">{student.first_name} {student.last_name}</p>
              <p className="font-body text-[13px] text-[#8B8A83] mt-1">
                GR {student.grno} · Father: {student.father_name} · Class {student.class}
              </p>
            </div>

            {error && (
              <div role="alert" className="font-body mb-6 flex items-start gap-2.5 rounded-md border border-[#EDE0C4] bg-[#FBF6EC] px-4 py-3 text-[13px] text-[#8A6D2F]">
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8873D]" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {field('Progress', 'progress')}
                {field('Date of leaving', 'date_of_leaving', 'date', { required: true })}
                {field('Class at leaving', 'class_at_leaving', 'text', { required: true })}
                {field('Reason for leaving', 'reason_for_leaving', 'text', { required: true })}
              </div>
              <div className="mb-8">
                {field('Remarks', 'remarks')}
              </div>

              <button
                type="submit" disabled={saving}
                className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
                           transition hover:bg-[#0F1930] disabled:opacity-50"
              >
                {saving ? 'Issuing…' : 'Issue certificate'}
              </button>
            </form>
          </>
        )}

        {issued && (
          <div className="rounded-lg border border-[#D9E7D9] bg-[#F1F6F1] px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#3D6B3D]/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3D6B3D" strokeWidth="2" className="h-5 w-5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="font-display text-[20px] font-medium text-[#1B2333] mb-1.5">Certificate issued</h2>
            <p className="font-body text-[14px] text-[#3D6B3D] mb-6">GR {grno} — leaving certificate created.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => certificateApi.viewPdf(grno)}
                className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0F1930]"
              >
                View / print PDF
              </button>
              <button
                onClick={() => navigate('/students')}
                className="font-body rounded-md border border-[#E4DFD3] px-5 py-2.5 text-[14px] text-[#5B5954] transition hover:border-[#1B2333]/20"
              >
                Back to students
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}