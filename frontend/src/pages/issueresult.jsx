import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi, resultCardApi } from '../api/Client';

export default function IssueResultCard() {
  const [grno, setGrno] = useState('');
  const [student, setStudent] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [form, setForm] = useState({ session: '', term: '', class: '' });
  const [subjects, setSubjects] = useState([{ subject: '', totalMarks: '', obtainedMarks: '' }]);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);
  const navigate = useNavigate();

  const lookup = async () => {
    if (!grno) return;
    setLookupError(''); setStudent(null); setCreated(null);
    try {
      const data = await studentApi.getOne(grno);
      setStudent(data);
      setForm((f) => ({ ...f, class: data.class }));
    } catch (err) { setLookupError(err.message); }
  };

  const updateSubject = (i, key, val) => {
    const copy = [...subjects];
    copy[i][key] = val;
    setSubjects(copy);
  };
  const addSubject = () => setSubjects([...subjects, { subject: '', totalMarks: '', obtainedMarks: '' }]);
  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const payload = {
        grno, ...form, remarks,
        subjects: subjects.map(s => ({ subject: s.subject, totalMarks: +s.totalMarks, obtainedMarks: +s.obtainedMarks }))
      };
      const data = await resultCardApi.create(payload);
      setCreated(data);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-[14px] bg-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#2B2A28]/10 focus:border-[#2B2A28] focus:bg-white transition";

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#E4E1DA]">
        <button onClick={() => navigate('/certificates')} className="text-[13px] text-[#8A877F] hover:text-[#201F1D]">← Certificates</button>
        <span className="text-[13px] text-[#5B5954]">Administrator</span>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-[24px] font-semibold text-[#201F1D] mb-1">Issue result card</h1>
        <p className="text-[13.5px] text-[#8A877F] mb-8">Enter GR No, then subject marks</p>

        <div className="flex gap-3 mb-6">
          <input placeholder="Enter GR No…" value={grno} onChange={(e) => setGrno(e.target.value)} className={inputCls + " max-w-xs"} />
          <button onClick={lookup} className="bg-[#2B2A28] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg">Find student</button>
        </div>
        {lookupError && <div className="bg-[#FBF6EC] text-[#8A6D2F] text-sm px-4 py-2.5 rounded-lg mb-6">{lookupError}</div>}

        {student && !created && (
          <>
            <div className="mb-6 border border-[#E4E1DA] rounded-lg px-5 py-4">
              <p className="text-[15px] font-medium">{student.first_name} {student.last_name}</p>
              <p className="text-[12.5px] text-[#8A877F]">GR {student.grno} · Class {student.class}</p>
            </div>

            {error && <div className="bg-[#FBF6EC] text-[#8A6D2F] text-sm px-4 py-2.5 rounded-lg mb-5">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <input placeholder="Session (2025-2026)" value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} required className={inputCls} />
                <input placeholder="Term (Final Term)" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} required className={inputCls} />
                <input placeholder="Class" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required className={inputCls} />
              </div>

              <p className="text-[13px] font-medium mb-2">Subjects</p>
              {subjects.map((s, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 mb-2">
                  <input placeholder="Subject" value={s.subject} onChange={(e) => updateSubject(i, 'subject', e.target.value)} required className={inputCls} />
                  <input placeholder="Total" type="number" value={s.totalMarks} onChange={(e) => updateSubject(i, 'totalMarks', e.target.value)} required className={inputCls} />
                  <input placeholder="Obtained" type="number" value={s.obtainedMarks} onChange={(e) => updateSubject(i, 'obtainedMarks', e.target.value)} required className={inputCls} />
                  <button type="button" onClick={() => removeSubject(i)} className="text-[#B3402A] text-sm px-2">✕</button>
                </div>
              ))}
              <button type="button" onClick={addSubject} className="text-[13px] text-[#2B2A28] font-medium mb-6">+ Add subject</button>

              <textarea placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inputCls + " mb-6"} rows={2} />

              <button type="submit" disabled={saving} className="bg-[#2B2A28] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg disabled:opacity-50">
                {saving ? 'Saving…' : 'Create result card'}
              </button>
            </form>
          </>
        )}

        {created && (
          <div className="border border-[#D9E7D9] bg-[#F1F6F1] rounded-lg px-6 py-8 text-center">
            <p className="text-[18px] font-medium mb-1">Result card created</p>
            <p className="text-[14px] text-[#3D6B3D] mb-6">{created.percentage}% — Grade {created.grade || '—'}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => resultCardApi.viewPdf(created._id)} className="bg-[#2B2A28] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg">View / print PDF</button>
              <button onClick={() => navigate('/certificates')} className="border border-[#E4E1DA] text-[14px] px-5 py-2.5 rounded-lg">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}