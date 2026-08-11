import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../api/Client';
import StudentFormModal from '../components/Studentformmodal';
import * as XLSX from 'xlsx';

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

  const handleExport = () => {
    if (filtered.length === 0) {
      alert('No students to export');
      return;
    }

    const rows = filtered.map((s) => ({
      'GR No': s.grno,
      'First Name': s.first_name,
      'Last Name': s.last_name,
      'Father Name': s.father_name,
      'Father Contact No': s.father_no,
      'Father CNIC': s.father_cnic,
      'Date of Birth': s.dob ? new Date(s.dob).toLocaleDateString('en-GB') : '',
      'Class': s.class,
      'Cast': s.cast,
      'Religion': s.religion,
      'Place of Birth': s.place_of_birth,
      'Last School Attended': s.last_school_attended,
      'Date of Admission': s.date_of_admission ? new Date(s.date_of_admission).toLocaleDateString('en-GB') : '',
      'Class at Admission': s.class_at_admission,
      'Conduct': s.conduct
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(12, key.length + 2)
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `students_export_${stamp}.xlsx`);
  };

  const filtered = students.filter((s) => {
    const matchesGrno = s.grno?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = s.class?.toLowerCase().includes(classSearch.toLowerCase());
    return matchesGrno && matchesClass;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* top bar — consistent with Dashboard */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#E4E1DA]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#8A877F] hover:text-[#201F1D] text-[13px] flex items-center gap-1"
          >
            ← Dashboard
          </button>
        </div>
        <span className="text-[13px] text-[#5B5954]">Administrator</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-[#201F1D]">Students</h1>
            <p className="text-[13.5px] text-[#8A877F] mt-1">
              {students.length} student{students.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>
          <div className="flex items-center gap-3">
  <button onClick={() => navigate('/import')}
    className="rounded-md border border-[#E4E1DA] px-5 py-2.5 text-[14px] font-medium text-[#201F1D] hover:bg-[#F2F0EF]">
    Import from Excel
  </button>
  <button onClick={handleExport}
    className="rounded-md border border-[#E4E1DA] px-5 py-2.5 text-[14px] font-medium text-[#201F1D] hover:bg-[#F2F0EF]">
    Export to Excel
  </button>
  <button onClick={() => setModalMode('add')}
    className="rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#0F1930]">
    + Add student
  </button>
</div>
          {/* <button
            onClick={() => setModalMode('add')}
            className="text-[14px] font-semibold text-white bg-[#2B2A28] px-5 py-2.5 rounded-lg hover:bg-[#201F1D] transition"
          >
            + Add student
          </button>
          <button
  onClick={() => navigate('/import')}
  className="rounded-md border border-[#E4E1DA] px-5 py-2.5 text-[14px] font-medium text-[#201F1D] hover:bg-[#F2F0EF] mr-3"
>
  Import from Excel
</button> */}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by GR No…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-[14px]
                       bg-[#FAF9F7] placeholder:text-[#B3AFA6]
                       focus:outline-none focus:ring-2 focus:ring-[#2B2A28]/10 focus:border-[#2B2A28] focus:bg-white
                       transition"
          />
          <input
            type="text"
            placeholder="Search by class…"
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            className="w-full max-w-xs border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-[14px]
                       bg-[#FAF9F7] placeholder:text-[#B3AFA6]
                       focus:outline-none focus:ring-2 focus:ring-[#2B2A28]/10 focus:border-[#2B2A28] focus:bg-white
                       transition"
          />
        </div>

        {error && (
          <div className="bg-[#FBF6EC] border border-[#EDE0C4] text-[#8A6D2F] text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="border border-[#E4E1DA] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F2F0EF] text-[12.5px] text-[#5B5954] font-semibold uppercase tracking-wide">
                <th className="px-5 py-3">GR No</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Father name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1DA]">
              {loading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#8A877F] text-sm">Loading…</td></tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#8A877F] text-sm">
                  {students.length === 0 ? 'No students yet — click "Add student" to get started.' : 'No match for that GR No.'}
                </td></tr>
              )}

              {!loading && filtered.map((s) => (
                <tr key={s._id} className="text-[14px] text-[#201F1D] hover:bg-[#FAF9F7] transition">
                  <td className="px-5 py-3.5 font-medium">{s.grno}</td>
                  <td className="px-5 py-3.5">{s.first_name} {s.last_name}</td>
                  <td className="px-5 py-3.5 text-[#5B5954]">{s.father_name || '—'}</td>
                  <td className="px-5 py-3.5 text-[#5B5954]">{s.class || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setActiveStudent(s); setModalMode('view'); }}
                        className="text-[13px] text-[#5B5954] hover:text-[#2B2A28] px-2 py-1"
                      >
                        View
                      </button>
                      <button
                        onClick={() => { setActiveStudent(s); setModalMode('edit'); }}
                        className="text-[13px] text-[#2B2A28] font-medium hover:underline px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.grno)}
                        className="text-[13px] text-[#B3402A] hover:underline px-2 py-1"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#E4E1DA]">
              <h2 className="text-[18px] font-semibold text-[#201F1D]">{activeStudent.grno}</h2>
              <button
                onClick={() => { setModalMode(null); setActiveStudent(null); }}
                className="text-[#8A877F] hover:text-[#201F1D] text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-7 py-5 space-y-3 text-[14px]">
              {[
                ['Name', `${activeStudent.first_name} ${activeStudent.last_name || ''}`],
                ['Father name', activeStudent.father_name],
                ['Father contact', activeStudent.father_no],
                ['Father CNIC', activeStudent.father_cnic],
                ['Date of birth', activeStudent.dob?.slice(0, 10)],
                ['Class', activeStudent.class],
                ['Cast', activeStudent.cast],
                ['Religion', activeStudent.religion],
                ['Place of birth', activeStudent.place_of_birth],
                ['Last school attended', activeStudent.last_school_attended],
                ['Date of admission', activeStudent.date_of_admission?.slice(0, 10)],
                ['Class at admission', activeStudent.class_at_admission],
                ['Conduct', activeStudent.conduct]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#F2F0EF] pb-2">
                  <span className="text-[#8A877F]">{label}</span>
                  <span className="text-[#201F1D] font-medium">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}