import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { importApi } from '../api/client';

export default function ImportStudents() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [report, setReport] = useState(null); // { totalRows, validCount, skippedCount, validRows, skipped, warnings }
  const [imported, setImported] = useState(null); // { insertedCount, message }
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const resetAll = () => {
    setFile(null);
    setReport(null);
    setImported(null);
    setError('');
  };

  const handleFileChange = (selected) => {
    if (!selected) return;
    resetAll();
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileChange(dropped);
  };

  const handlePreview = async () => {
    if (!file) return;
    setPreviewing(true);
    setError('');
    setReport(null);
    try {
      const data = await importApi.preview(file);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewing(false);
    }
  };

  const handleConfirm = async () => {
    if (!report?.validRows?.length) return;
    setConfirming(true);
    setError('');
    try {
      const data = await importApi.confirm(report.validRows);
      setImported(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* top bar — consistent with Students/Dashboard */}
      <div className="sticky top-0 z-10 border-b border-[#E4DFD3] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
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
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#B8873D] mb-2">BULK ENTRY</p>
        <h1 className="font-display text-[28px] font-medium text-[#1B2333] mb-1.5">
          Import students from Excel
        </h1>
        <p className="font-body text-[13.5px] text-[#8B8A83] mb-10">
          Upload a .xlsx file, review what will be imported, then confirm.
        </p>

        {error && (
          <div
            role="alert"
            className="font-body mb-6 flex items-start gap-2.5 rounded-md border border-[#EDE0C4] bg-[#FBF6EC] px-4 py-3 text-[13px] text-[#8A6D2F]"
          >
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8873D]" />
            {error}
          </div>
        )}

        {imported && (
          <div className="rounded-lg border border-[#D9E7D9] bg-[#F1F6F1] px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#3D6B3D]/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3D6B3D" strokeWidth="2" className="h-5 w-5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="font-display text-[20px] font-medium text-[#1B2333] mb-1.5">
              Import complete
            </h2>
            <p className="font-body text-[14px] text-[#3D6B3D] mb-6">{imported.message}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/students')}
                className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0F1930]"
              >
                View students
              </button>
              <button
                onClick={resetAll}
                className="font-body rounded-md border border-[#E4DFD3] px-5 py-2.5 text-[14px] text-[#5B5954] transition hover:border-[#1B2333]/20"
              >
                Import another file
              </button>
            </div>
          </div>
        )}

        {!imported && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`font-body cursor-pointer rounded-lg border-2 border-dashed px-6 py-12 text-center transition
                          ${dragActive ? 'border-[#B8873D] bg-[#FAF6EC]' : 'border-[#E4DFD3] bg-[#FAF8F3] hover:border-[#B8873D]/50'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />

              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#E4DFD3] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#B8873D" strokeWidth="1.7" className="h-5 w-5">
                  <path d="M12 15V3m0 0 4 4m-4-4L8 7" />
                  <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                </svg>
              </div>

              {file ? (
                <>
                  <p className="text-[14px] font-medium text-[#1B2333]">{file.name}</p>
                  <p className="font-mono text-[11px] tracking-[0.1em] text-[#B7B2A4] mt-1">
                    {(file.size / 1024).toFixed(0)} KB — click to choose a different file
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[14px] font-medium text-[#1B2333]">
                    Drag and drop your Excel file here
                  </p>
                  <p className="text-[13px] text-[#8B8A83] mt-1">or click to browse — .xlsx or .xls</p>
                </>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handlePreview}
                disabled={!file || previewing}
                className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
                           transition hover:bg-[#0F1930] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {previewing ? 'Reading file…' : 'Preview import'}
              </button>
            </div>

            {report && (
              <div className="mt-10">
                <div className="mb-4 flex items-center gap-3">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#8B8A83]">RESULTS</p>
                  <div className="h-px flex-1 bg-[#E4DFD3]" />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="rounded-md border border-[#E4DFD3] bg-white px-4 py-3.5">
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[#8B8A83]">TOTAL ROWS</p>
                    <p className="font-display text-[22px] text-[#1B2333] mt-0.5">{report.totalRows}</p>
                  </div>
                  <div className="rounded-md border border-[#D9E7D9] bg-[#F1F6F1] px-4 py-3.5">
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[#3D6B3D]">READY TO IMPORT</p>
                    <p className="font-display text-[22px] text-[#3D6B3D] mt-0.5">{report.validCount}</p>
                  </div>
                  <div className="rounded-md border border-[#F0DCD4] bg-[#FBF0EC] px-4 py-3.5">
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[#A6503B]">SKIPPED</p>
                    <p className="font-display text-[22px] text-[#A6503B] mt-0.5">{report.skippedCount}</p>
                  </div>
                </div>

                {report.skipped?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-body text-[13px] font-medium text-[#1B2333] mb-2">
                      Skipped rows ({report.skipped.length})
                    </p>
                    <div className="rounded-md border border-[#F0DCD4] bg-[#FBF0EC] divide-y divide-[#F0DCD4]">
                      {report.skipped.map((item, i) => (
                        <div key={i} className="font-body px-4 py-2.5 text-[13px] text-[#A6503B] flex items-start gap-2">
                          <span className="font-mono text-[10px] text-[#A6503B]/60 mt-[3px] shrink-0">
                            ROW {item.rowNumber}
                          </span>
                          {item.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.warnings?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-body text-[13px] font-medium text-[#1B2333] mb-2">
                      Imported with warnings ({report.warnings.length})
                    </p>
                    <div className="rounded-md border border-[#EDE0C4] bg-[#FBF6EC] divide-y divide-[#EDE0C4]">
                      {report.warnings.map((w, i) => (
                        <div key={i} className="font-body px-4 py-2.5 text-[13px] text-[#8A6D2F]">
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.validRows?.length > 0 && (
                  <div className="mb-8">
                    <p className="font-body text-[13px] font-medium text-[#1B2333] mb-2">
                      Preview — students to be added ({report.validRows.length})
                    </p>
                    <div className="overflow-hidden rounded-md border border-[#E4DFD3]">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="font-mono border-b border-[#E4DFD3] bg-[#F5F1E8] text-[10.5px] tracking-[0.08em] text-[#8B8A83]">
                            <th className="px-4 py-2.5 font-medium">GR NO</th>
                            <th className="px-4 py-2.5 font-medium">NAME</th>
                            <th className="px-4 py-2.5 font-medium">CLASS</th>
                          </tr>
                        </thead>
                        <tbody className="font-body divide-y divide-[#E4DFD3]">
                          {report.validRows.slice(0, 8).map((r, i) => (
                            <tr key={i} className="text-[13px] text-[#1B2333]">
                              <td className="px-4 py-2.5 font-medium">{r.grno}</td>
                              <td className="px-4 py-2.5">{r.first_name} {r.last_name}</td>
                              <td className="px-4 py-2.5 text-[#5B5954]">{r.class}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {report.validRows.length > 8 && (
                        <p className="font-mono text-[10.5px] tracking-[0.08em] text-[#B7B2A4] px-4 py-2.5 bg-[#FAF8F3]">
                          + {report.validRows.length - 8} MORE
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetAll}
                    className="font-body rounded-md border border-[#E4DFD3] px-5 py-2.5 text-[14px] text-[#5B5954] transition hover:border-[#1B2333]/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!report.validRows?.length || confirming}
                    className="font-body rounded-md bg-[#1B2333] px-5 py-2.5 text-[14px] font-medium text-white
                               transition hover:bg-[#0F1930] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {confirming ? 'Importing…' : `Confirm import (${report.validCount})`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}