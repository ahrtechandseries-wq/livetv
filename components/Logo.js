export default function Logo({ size = 32, animated = false, iconOnly = false }) {

  return (
    <div
      className={`flex items-center gap-2 select-none ${animated ? 'animate-nex-glow' : ''}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Original mark: a stylized "N" built from a signal /
            play-bar motif, not the Netflix ribbon shape. */}
        <rect x="4" y="4" width="40" height="40" rx="10" fill="#141417" />
        <path
          d="M14 34V14h4.6l10.8 15.2V14H34v20h-4.6L18.6 18.8V34H14z"
          fill="#C4172C"
        />
        <rect x="14" y="14" width="4" height="20" rx="1" fill="#F2F2F3" opacity="0.9" />
      </svg>
      {!iconOnly && (
        <span className="font-bold tracking-wide text-lg text-nex-text">
          Nex<span className="text-nex-red">Live</span>
        </span>
      )}
    </div>
  );

}
