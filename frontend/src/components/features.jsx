import { useNavigate } from 'react-router-dom';

export default function FeatureTile({ icon, title, description, to, comingSoon }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => !comingSoon && navigate(to)}
      disabled={comingSoon}
      className={`group relative flex w-full items-start gap-4 rounded-md border py-5 pl-9 pr-5 text-left
                  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  ${comingSoon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:-translate-y-0.5'}`}
      style={{
        borderColor: 'var(--rule)',
        backgroundColor: comingSoon ? 'transparent' : 'var(--paper-raised)',
      }}
      onMouseEnter={(e) => {
        if (comingSoon) return;
        e.currentTarget.style.borderColor = 'var(--brass)';
        e.currentTarget.style.boxShadow = '0 8px 22px -12px rgba(169, 120, 46, 0.45)';
      }}
      onMouseLeave={(e) => {
        if (comingSoon) return;
        e.currentTarget.style.borderColor = 'var(--rule)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* filed-card perforation strip */}
      <span className="absolute left-0 top-0 h-full w-5 border-r border-dashed" style={{ borderColor: 'var(--rule)' }} aria-hidden="true">
        <span
          className="absolute left-1/2 top-4 h-2 w-2 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: 'var(--paper)', boxShadow: '0 0 0 1px var(--rule)' }}
        />
      </span>

      <span
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors"
        style={{ borderColor: comingSoon ? 'var(--rule)' : 'rgba(169,120,46,0.45)', color: 'var(--ink)' }}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-body text-[14.5px] font-semibold" style={{ color: 'var(--ink)' }}>
            {title}
          </span>
          <span
            className="shrink-0 font-mono text-[9.5px] tracking-[0.14em] opacity-0 transition-opacity group-hover:opacity-100"
            style={{ color: comingSoon ? 'var(--ink-soft)' : 'var(--brass)', opacity: comingSoon ? 0.7 : undefined }}
          >
            {comingSoon ? 'LOCKED' : 'OPEN \u2192'}
          </span>
        </span>
        <span className="mt-1 block font-body text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {comingSoon ? 'Coming soon' : description}
        </span>
      </span>
    </button>
  );
}