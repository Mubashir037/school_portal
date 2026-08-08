import { useState, useEffect } from 'react';
import { studentApi } from '../api/client';

const emptyForm = {
  grno: '', first_name: '', last_name: '', father_name: '',
  father_no: '', father_cnic: '', dob: '', class: '', cast: '',
  religion: '', place_of_birth: '', last_school_attended: '',
  date_of_admission: '', class_at_admission: '', conduct: ''
};

export default function StudentFormModal({ mode, student, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && student) {
      setForm({
        grno: student.grno || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        father_name: student.father_name || '',
        father_no: student.father_no || '',
        father_cnic: student.father_cnic || '',
        dob: student.dob ? student.dob.slice(0, 10) : '',
        class: student.class || '',
        cast: student.cast || '',
        religion: student.religion || '',
        place_of_birth: student.place_of_birth || '',
        last_school_attended: student.last_school_attended || '',
        date_of_admission: student.date_of_admission ? student.date_of_admission.slice(0, 10) : '',
        class_at_admission: student.class_at_admission || '',
        conduct: student.conduct || ''
      });
    }
  }, [mode, student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'add') {
        await studentApi.create(form);
      } else {
        await studentApi.update(student.grno, form);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = 'text', extra = {}) => (
    <div>
      <label className="block text-[13px] font-medium text-[#201F1D] mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        {...extra}
        className="w-full border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-[14px] text-[#201F1D]
                   bg-[#FAF9F7] placeholder:text-[#B3AFA6]
                   focus:outline-none focus:ring-2 focus:ring-[#2B2A28]/10 focus:border-[#2B2A28] focus:bg-white
                   transition"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#E4E1DA]">
          <h2 className="text-[19px] font-semibold text-[#201F1D]">
            {mode === 'add' ? 'Add student' : `Edit student — ${student.grno}`}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8A877F] hover:text-[#201F1D] text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6">
          {error && (
            <div className="bg-[#FBF6EC] border border-[#EDE0C4] text-[#8A6D2F] text-sm px-3.5 py-2.5 rounded-md mb-5">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-2">
            {field('GR No', 'grno', 'text', { required: true, disabled: mode === 'edit' })}
            {field('Class', 'class')}
            {field('First name', 'first_name', 'text', { required: true })}
            {field('Last name', 'last_name')}
            {field('Father name', 'father_name')}
            {field('Father contact number', 'father_no', 'text', { placeholder: '03001234567' })}
            {field('Father CNIC', 'father_cnic', 'text', { placeholder: '13-digit CNIC' })}
            {field('Date of birth', 'dob', 'date')}
            {field('Cast', 'cast')}
            {field('Religion', 'religion', 'text', { required: true })}
            {field('Place of birth', 'place_of_birth', 'text', { required: true })}
            {field('Last school attended', 'last_school_attended', 'text', { required: true })}
            {field('Date of admission', 'date_of_admission', 'date', { required: true })}
            {field('Class at admission', 'class_at_admission', 'text', { required: true })}
            {field('Conduct', 'conduct', 'text', { required: true })}
          </div>

          <div className="flex items-center justify-end gap-3 mt-7 pt-5 border-t border-[#E4E1DA]">
            <button
              type="button"
              onClick={onClose}
              className="text-[14px] font-medium text-[#5B5954] px-4 py-2.5 rounded-lg hover:bg-[#F2F0EF] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-[14px] font-medium text-white bg-[#2B2A28] px-5 py-2.5 rounded-lg
                         hover:bg-[#201F1D] disabled:opacity-50 transition"
            >
              {loading ? 'Saving…' : mode === 'add' ? 'Add student' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}