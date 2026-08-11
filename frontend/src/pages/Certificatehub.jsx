import { useNavigate } from 'react-router-dom';
import FeatureTile from '../components/features';

export default function CertificatesHub() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#E4E1DA]">
        <button onClick={() => navigate('/dashboard')} className="text-[13px] text-[#8A877F] hover:text-[#201F1D]">← Dashboard</button>
        <span className="text-[13px] text-[#5B5954]">Administrator</span>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-14">
        <h1 className="text-[24px] font-semibold text-[#201F1D] mb-1">Certificates</h1>
        <p className="text-[13.5px] text-[#8A877F] mb-10">Choose a document type</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FeatureTile to="/issue-certificate" title="Leaving certificate" description="School leaving certificate by GR No" icon={<span>📄</span>} />
          <FeatureTile to="/result-card" title="Result card" description="Term/annual result card" icon={<span>📊</span>} />
          {/* <FeatureTile to="/marksheet" comingSoon title="Marksheet" description="Subject-wise marksheet" icon={<span>📝</span>} />
          <FeatureTile to="/character-certificate" comingSoon title="Character certificate" description="Conduct/character certificate" icon={<span>🎓</span>} /> */}
        </div>
      </div>
    </div>
  );
}