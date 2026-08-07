import { useState, useEffect } from 'react';
import { studentApi } from '../api/Client';

const emptyForm = {
  grno: '', first_name: '', last_name: '', father_name: '',
  father_no: '', father_cnic: '', dob: '', class: '', cast: ''
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
        cast: student.cast || ''
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
    <div className={extra.disabled ? 'opacity-60' : ''}>
      <label
        className="mb-1.5 flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em]"
        style={{ color: 'var(--ink-soft)' }}
      >
        {label}
        {extra.required && <span style={{ color: 'var(--redink)' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        {...extra}
        className="w-full border-0 border-b bg-transparent px-0.5 py-2 font-body text-[14.5px] outline-none
                   transition-colors disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--brass)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--rule)'; }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(30,42,68,0.55)', backdropFilter: 'blur(2px)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        :root {
          --paper: #EFEEE3;
          --paper-raised: #F8F7F0;
          --ink: #1E2A44;
          --ink-soft: #5C6270;
          --rule: #D7D4C4;
          --brass: #A9782E;
          --brass-soft: #C9A55C;
          --redink: #9C3B2E;
        }

        .font-display { font-family: 'Newsreader', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        input::placeholder { color: var(--ink-soft); opacity: 0.45; }
      `}</style>

      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-lg shadow-2xl"
        style={{ backgroundColor: 'var(--paper-raised)', maxHeight: '90vh' }}
      >
        {/* header, with a faint watermark seal for continuity with the dashboard */}
        <div className="relative overflow-hidden border-b px-7 py-5" style={{ borderColor: 'var(--rule)' }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full border-2"
            style={{ borderColor: 'var(--brass)', opacity: 0.08, transform: 'rotate(-6deg)' }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="font-mono text-[9.5px] tracking-[0.16em]" style={{ color: 'var(--brass)' }}>
                {mode === 'add' ? 'NEW ENTRY' : 'EDIT ENTRY'}
              </p>
              <h2 className="font-display text-[19px] font-medium" style={{ color: 'var(--ink)' }}>
                {mode === 'add' ? 'New student record' : `Edit record — GR ${student.grno}`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-xl leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: 'var(--ink-soft)' }}
              aria-label="Close"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-soft)'; }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-7 py-6" style={{ maxHeight: 'calc(90vh - 78px)' }}>
          {error && (
            <div
              className="mb-5 rounded-md border px-3.5 py-2.5 font-body text-[13px]"
              style={{ backgroundColor: 'rgba(156,59,46,0.08)', borderColor: 'rgba(156,59,46,0.3)', color: 'var(--redink)' }}
            >
              {error}
            </div>
          )}

          <div className="mb-2 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {field('GR No', 'grno', 'text', { required: true, disabled: mode === 'edit' })}
            {field('Class', 'class')}
            {field('First name', 'first_name', 'text', { required: true })}
            {field('Last name', 'last_name')}
            {field('Father name', 'father_name')}
            {field('Father contact number', 'father_no', 'text', { placeholder: '03001234567' })}
            {field('Father CNIC', 'father_cnic', 'text', { placeholder: '13-digit CNIC' })}
            {field('Date of birth', 'dob', 'date')}
            {field('Cast', 'cast')}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t pt-5" style={{ borderColor: 'var(--rule)' }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 font-body text-[14px] font-medium transition-colors"
              style={{ color: 'var(--ink-soft)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--paper)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md px-5 py-2.5 font-body text-[14px] font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--ink)' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#141C30'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--ink)'; }}
            >
              {loading ? 'Saving…' : mode === 'add' ? 'Add record' : 'Save record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}