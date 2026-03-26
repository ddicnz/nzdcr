/** Small line icons for vehicle spec grid (Description tab). */
const defaultProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icons = {
  doors: (
    <svg {...defaultProps} aria-hidden>
      <path d="M4 18V6a2 2 0 0 1 2-2h5l7 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M11 6v6" />
      <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  ac: (
    <svg {...defaultProps} aria-hidden>
      <path d="M12 2v4M12 18v4M5 12H2M22 12h-3M6.3 6.3 4 4M20 20l-2.2-2.2M6.3 17.7 4 4M20 4l-2.2 2.2M17.7 6.3 20 4M4 20l2.2-2.2" />
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
      <path d="M12 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2z" />
      <path d="M12 12v4M10 16h4M6 8l2 2M18 8l-2 2M8.5 19h7a2 2 0 0 0 2-2v-3l2-2V9l-2-2V6a2 2 0 0 0-2-2h-1" />
    </svg>
  ),
}

export default function CarDetailSpecIcon({ name }) {
  const node = icons[name] ?? icons.doors
  return <span className="car-detail__spec-icon">{node}</span>
}
