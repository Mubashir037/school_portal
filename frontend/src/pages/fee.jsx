import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi, feeApi } from '../api/client';

export default function FeeManagement() {
  const [grno, setGrno] = useState('');
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputCls = "w-full border border-[#E4E1DA] rounded-lg px-3.5 py-2.5 text-[14px] bg-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#2B2A28]/10 focus:border-[#2B2A28] focus:bg-white transition";

  const lookup = async () => {
    if (!grno) return;
    setError('');
    try {
      const s = await studentApi.getOne(grno);
      setStudent(s);
      const f = await feeApi.getByStudent(grno);
      setFees(f);
    } catch (err) { setError(err.message); }
  };

  const generate = async () => {
    if (!month) return;
    try {
      await feeApi.generate({ grno, month });
      const f = await feeApi.getByStudent(grno);
      setFees(f);
      setMonth('');
    } catch (err) { setError(err.message); }
  };

  const pay = async (id) => {
    await feeApi.markPaid(id);
    const f = await feeApi.getByStudent(grno);
    setFees(f);
    feeApi.viewReceipt(id);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#E4E1DA]">
        <button onClick={() => navigate('/dashboard')} className="text-[13px] text-[#8A877F] hover:text-[#201F1D]">← Dashboard</button>
        <span className="text-[13px] text-[#5B5954]">Administrator</span>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-[24px] font-semibold text-[#201F1D] mb-1">Fee management</h1>
        <p className="text-[13.5px] text-[#8A877F] mb-8">Enter GR No to view/generate fees</p>

        <div className="flex gap-3 mb-6">
          <input placeholder="Enter GR No…" value={grno} onChange={(e) => setGrno(e.target.value)} className={inputCls + " max-w-xs"} />
          <button onClick={lookup} className="bg-[#2B2A28] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg">Find student</button>
        </div>
        {error && <div className="bg-[#FBF6EC] text-[#8A6D2F] text-sm px-4 py-2.5 rounded-lg mb-6">{error}</div>}

        {student && (
          <>
            <div className="mb-6 border border-[#E4E1DA] rounded-lg px-5 py-4">
              <p className="text-[15px] font-medium">{student.first_name} {student.last_name}</p>
              <p className="text-[12.5px] text-[#8A877F]">GR {student.grno} · Class {student.class}</p>
            </div>

            <div className="flex gap-3 mb-6">
              <input placeholder="Month (2026-08)" value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls + " max-w-xs"} />
              <button onClick={generate} className="border border-[#E4E1DA] text-[14px] font-medium px-5 py-2.5 rounded-lg">Generate fee</button>
            </div>

            <table className="w-full text-left border border-[#E4E1DA] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#F2F0EF] text-[11px] text-[#5B5954] font-semibold uppercase">
                  <th className="px-4 py-2.5">Month</th><th className="px-4 py-2.5">Amount</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1DA] text-[14px]">
                {fees.map(f => (
                  <tr key={f._id}>
                    <td className="px-4 py-2.5">{f.month}</td>
                    <td className="px-4 py-2.5">Rs {f.amount}</td>
                    <td className={`px-4 py-2.5 ${f.status === 'Paid' ? 'text-[#3D6B3D]' : 'text-[#B3402A]'}`}>{f.status}</td>
                    <td className="px-4 py-2.5">
                      {f.status === 'Unpaid'
                        ? <button onClick={() => pay(f._id)} className="text-[13px] font-medium text-[#2B2A28] hover:underline">Mark paid</button>
                        : <button onClick={() => feeApi.viewReceipt(f._id)} className="text-[13px] text-[#5B5954] hover:underline">Receipt</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}