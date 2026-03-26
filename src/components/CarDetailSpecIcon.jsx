/** Small line icons for vehicle spec grid (Description tab). */
const defaultProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icons = {
  doors: (
    <svg {...defaultProps} aria-hidden>
      <rect
        x="7.48"
        y="12.68"
        width="8.54"
        height="6.48"
        rx="1.12"
        ry="1.12"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M7.35 12.6H16.05V6.85H10.85Q10.05 6.85 9.35 7.42L7.35 12.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ac: (
    <svg {...defaultProps} aria-hidden>
      <g transform="translate(12,12)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M0 0v-8.25" />
            <path d="M0-3.3l-2.15-2.05M0-3.3l2.15-2.05M0-6.35l-1.55-1.45M0-6.35l1.55-1.45" />
          </g>
        ))}
      </g>
    </svg>
  ),
  seats: (
    <svg {...defaultProps} aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  automatic: (
    <svg {...defaultProps} aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
      >
        A
      </text>
    </svg>
  ),
  luggage: (
    <svg {...defaultProps} aria-hidden>
      <rect x="6" y="9" width="12" height="11" rx="2" />
      <path d="M9 9V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 14h6" />
    </svg>
  ),
  engine: (
    <svg {...defaultProps} aria-hidden>
      <ellipse cx="3.4" cy="11.5" rx="1.12" ry="1.48" transform="rotate(-18 3.4 11.5)" />
      <ellipse cx="2.55" cy="14.35" rx="1.05" ry="1.42" transform="rotate(-8 2.55 14.35)" />
      <ellipse cx="3.45" cy="16.9" rx="1.1" ry="1.38" transform="rotate(12 3.45 16.9)" />
      <path d="M8.65 14.6C7.75 13.9 8.05 12.15 9.25 11.35C9.9 9.65 12.1 8.95 14.05 9.45C15.6 8.35 18.05 8.25 19.85 9.35C21.65 8.75 23.35 10.4 23.35 12.65C23.5 14.9 21.95 17.35 19.25 17.85C17.35 18.65 14.75 18.55 12.95 17.75C11.25 18.05 9.35 17.55 8.35 16.05C7.35 16.15 7.55 15.35 8.65 14.6z" />
    </svg>
  ),
}

export default function CarDetailSpecIcon({ name }) {
  const node = icons[name] ?? icons.doors
  return <span className="car-detail__spec-icon">{node}</span>
}
