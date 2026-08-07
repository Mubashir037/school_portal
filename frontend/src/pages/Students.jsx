import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../api/client';
import StudentFormModal from '../components/StudentFormModal';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');

  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit' | 'view'
  const [activeStudent, setActiveStudent] = useState(null);

  const navigate = useNavigate();

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentApi.getAll();
      setStudents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (grno) => {
    if (!window.confirm(`Delete student ${grno}? This cannot be undone.`)) return;
    try {
      await studentApi.remove(grno);
      loadStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = students.filter((s) => {
    const matchesGrno = s.grno?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = s.class?.toLowerCase().includes(classSearch.toLowerCase());
    return matchesGrno && matchesClass;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* top bar — consistent with Dashboard */}
      <div className="sticky top-0 z-10 border-b border-[#E4DFD3] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-body flex items-center gap-1.5 text-[13px] text-[#8B8A83] transition hover:text-[#1B2333]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Dashboard
          </button>
          <span className="font-body text-[13px] text-[#5B5954]">Administrator</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#B8873D] mb-2">STUDENT RECORDS</p>
            <h1 className="font-display text-[28px] font-medium text-[#1B2333]">Students</h1>
            <p className="font-body text-[13.5px] text-[#8B8A83] mt-1">
              {students.length} student{students.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>
          <div className="flex items-center gap-3">
  <button
    onClick={() => navigate('/import')}
    className="font-body rounded-md border border-[#E4DFD3] px-5 py-2.5 text-[14px] font-medium text-[#1B2333]
               transition hover:border-[#1B2333]/20 hover:bg-[#FAF8F3]"
  >
    Import from Excel
  </button>
  <button
    onClick={() => setModalMode('add')}
    className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
               transition hover:bg-[#0F1930]"
  >
    + Add student
  </button>
</div>
          {/* <button
            onClick={() => setModalMode('add')}
            className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
                       transition hover:bg-[#0F1930]"
          >
            + Add student
          </button> */}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by GR No…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-body w-full max-w-xs rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 text-[14px]
                       placeholder:text-[#B7B2A4]
                       transition focus:border-[#B8873D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8873D]/20"
          />
          <input
            type="text"
            placeholder="Search by class…"
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            className="font-body w-full max-w-xs rounded-md border border-[#E4DFD3] bg-[#FAF8F3] px-3.5 py-2.5 text-[14px]
                       placeholder:text-[#B7B2A4]
                       transition focus:border-[#B8873D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B8873D]/20"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="font-body mb-6 flex items-start gap-2.5 rounded-md border border-[#EDE0C4] bg-[#FBF6EC] px-4 py-3 text-[13px] text-[#8A6D2F]"
          >
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8873D]" />
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-[#E4DFD3]">
          <table className="w-full text-left">
            <thead>
              <tr className="font-mono border-b border-[#E4DFD3] bg-[#F5F1E8] text-[11px] tracking-[0.1em] text-[#8B8A83]">
                <th className="px-5 py-3 font-medium">GR NO</th>
                <th className="px-5 py-3 font-medium">NAME</th>
                <th className="px-5 py-3 font-medium">FATHER NAME</th>
                <th className="px-5 py-3 font-medium">CLASS</th>
                <th className="px-5 py-3 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="font-body divide-y divide-[#E4DFD3]">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[#8B8A83]">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[#8B8A83]">
                    {students.length === 0
                      ? 'No students yet — click "Add student" to get started.'
                      : 'No match for that GR No.'}
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((s) => (
                  <tr key={s._id} className="text-[14px] text-[#1B2333] transition hover:bg-[#FAF8F3]">
                    <td className="px-5 py-3.5 font-medium">{s.grno}</td>
                    <td className="px-5 py-3.5">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="px-5 py-3.5 text-[#5B5954]">{s.father_name || '—'}</td>
                    <td className="px-5 py-3.5 text-[#5B5954]">{s.class || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setActiveStudent(s); setModalMode('view'); }}
                          className="rounded px-2.5 py-1 text-[13px] text-[#5B5954] transition hover:bg-[#F5F1E8] hover:text-[#1B2333]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { setActiveStudent(s); setModalMode('edit'); }}
                          className="rounded px-2.5 py-1 text-[13px] font-medium text-[#B8873D] transition hover:bg-[#F5F1E8]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.grno)}
                          className="rounded px-2.5 py-1 text-[13px] text-[#A6503B] transition hover:bg-[#FBF0EC]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {(modalMode === 'add' || modalMode === 'edit') && (
        <StudentFormModal
          mode={modalMode}
          student={activeStudent}
          onClose={() => { setModalMode(null); setActiveStudent(null); }}
          onSaved={() => { setModalMode(null); setActiveStudent(null); loadStudents(); }}
        />
      )}

      {modalMode === 'view' && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1930]/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4DFD3] px-7 py-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#B8873D] mb-1">STUDENT RECORD</p>
                <h2 className="font-display text-[19px] font-medium text-[#1B2333]">{activeStudent.grno}</h2>
              </div>
              <button
                onClick={() => { setModalMode(null); setActiveStudent(null); }}
                className="text-xl leading-none text-[#8B8A83] transition hover:text-[#1B2333]"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="font-body space-y-3 px-7 py-5 text-[14px]">
              {[
                ['Name', `${activeStudent.first_name} ${activeStudent.last_name || ''}`],
                ['Father name', activeStudent.father_name],
                ['Father contact', activeStudent.father_no],
                ['Father CNIC', activeStudent.father_cnic],
                ['Date of birth', activeStudent.dob?.slice(0, 10)],
                ['Class', activeStudent.class],
                ['Cast', activeStudent.cast],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#F5F1E8] pb-2">
                  <span className="text-[#8B8A83]">{label}</span>
                  <span className="font-medium text-[#1B2333]">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}