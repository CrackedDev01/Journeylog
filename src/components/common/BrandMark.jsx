const BrandMark = ({ className = '' }) => (
  <svg
    className={`brand-mark ${className}`.trim()}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="1" y="1" width="38" height="38" rx="13" fill="var(--brand-mark-background)" />
    <path
      d="m12 27 6-6 4 4 7-9"
      stroke="var(--brand-mark-accent)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M23.5 16H29v5.5" stroke="var(--brand-mark-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="27" r="1.8" fill="var(--brand-mark-accent)" />
    <circle cx="18" cy="21" r="1.5" fill="var(--brand-mark-background)" stroke="var(--brand-mark-accent)" strokeWidth="1.5" />
  </svg>
)

export default BrandMark
