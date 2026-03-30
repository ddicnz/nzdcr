import { SITE_SOCIAL_LINKS } from '../data/siteSocialLinks'

export default function SiteSocialCircles({ className = '' }) {
  return (
    <div className={`header-social ${className}`.trim()}>
      {SITE_SOCIAL_LINKS.map(({ label, href, imgSrc, imgMod }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="header-social__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={imgSrc}
            alt=""
            className={`header-social__img header-social__img--${imgMod}`}
            decoding="async"
          />
        </a>
      ))}
    </div>
  )
}
