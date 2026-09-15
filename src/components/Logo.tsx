export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 38 L16 18 L24 30 L32 14 L40 38"
        stroke="#22d3ee"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5 42 L16 22 L24 34 L32 18 L43 42"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M11 34 L16 24 L24 36 L32 22 L37 34"
        stroke="#22d3ee"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
        fill="none"
      />
    </svg>
  );
}

export function LogoFull() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={28} />
      <div className="leading-none">
        <span className="text-white font-bold text-lg tracking-tight">MEGH</span>
        <span className="text-accent-400 font-bold text-lg tracking-tight">-SCAN</span>
      </div>
    </div>
  );
}
