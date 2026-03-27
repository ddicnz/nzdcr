import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../navConfig'
import { LOGO_SRC } from '../constants'
import { RCM_BOOKING_LANDING } from '../data/rcmBooking'

function IconPhone() {
  return (
    <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  )
}

const HEADER_SOCIAL = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nzdcr/?fref=ts#',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16V11h-1c-1 0-1.3.62-1.3 1.26V15h2.2l-.35 3H13v6.95c4.56-.93 8-4.97 8-9.75z" /></svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://x.com/NZDCR',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://nz.pinterest.com/discountcarrent/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8-.11-.78-.2-2.08.43-2.97.38-.58 2.48-15.82 2.48-15.82s-.63-.13-1.29-.13c-1.69 0-2.92.98-2.92 2.18 0 1.04.65 1.85 1.64 3.08.46.62.53 1.47.38 2.31-.2 1.04-1.09 1.77-2.01 1.77-2.64 0-4.39-3.11-4.39-6.14 0-2.56 1.85-5.14 5.44-5.14 3.12 0 5.22 2.17 5.22 4.99 0 3.28-1.84 5.43-4.08 5.43-.83 0-1.62-.44-1.89-.95l-.52 2.02c-.19.74-.56 1.66-.83 2.22 1.24.38 2.56.59 3.93.59 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
    ),
  },
  {
    label: 'Yelp',
    href: 'https://www.yelp.co.nz/biz/nz-discount-car-rental-mangere',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
    ),
  },
]

function HeaderSocialLinks() {
  return (
    <div className="header-social">
      {HEADER_SOCIAL.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="header-social__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

function SubNavLink({ child, onClose }) {
  if (child.external) {
    return (
      <a href={child.to} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        {child.label}
      </a>
    )
  }
  return <Link to={child.to} onClick={onClose}>{child.label}</Link>
}

function NavItem({ item, mobile, onClose }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children?.length

  if (!hasChildren) {
    return (
      <Link className="nav__link" to={item.to} onClick={onClose}>
        {item.label}
      </Link>
    )
  }

  return (
    <div
      className={`nav__item ${open ? 'nav__item--open' : ''}`}
      onMouseEnter={() => !mobile && setOpen(true)}
      onMouseLeave={() => !mobile && setOpen(false)}
    >
      {mobile ? (
        <button
          type="button"
          className="nav__link nav__link--dropdown"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {item.label}
          <span className="caret" aria-hidden>▾</span>
        </button>
      ) : (
        <Link className="nav__link" to={item.to} onClick={onClose}>
          {item.label}
          <span className="caret" aria-hidden>▾</span>
        </Link>
      )}
      <ul className="nav__sub">
        {mobile ? (
          <li><Link to={item.to} onClick={onClose}>{item.label}</Link></li>
        ) : null}
        {item.children.map((child) => (
          <li key={`${child.label}-${child.to}`}>
            <SubNavLink child={child} onClose={onClose} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const { pathname } = useLocation()
  const homeBookingAlign = pathname === '/'

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="container header-top__inner">
          <Link to="/" className="header-logo-link" onClick={closeMenu}>
            <img src={LOGO_SRC} alt="Discount Car Rentals" className="header-logo-img" />
          </Link>
          <div className="header-top__right">
            <button type="button" className="header-lang">
              English
              <span className="header-lang__caret" aria-hidden>▾</span>
            </button>
            <a href="tel:080017951795" className="header-line header-line--phone">
              <IconPhone />
              <span>0800 1795 1795</span>
            </a>
            <a href="mailto:booking@nzdcr.co.nz" className="header-line header-line--mail">
              <IconMail />
              <span>booking@nzdcr.co.nz</span>
            </a>
            <HeaderSocialLinks />
          </div>
        </div>
      </div>
      <div
        className={`header-nav-row${homeBookingAlign ? ' header-nav-row--home-booking-align' : ''}`}
      >
        <div className="container header-nav-row__inner">
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main">
            {NAV.map((item) => (
              <NavItem key={item.label} item={item} mobile={menuOpen} onClose={closeMenu} />
            ))}
          </nav>
          <a
            href={RCM_BOOKING_LANDING}
            className="header-checkin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check-in
          </a>
        </div>
      </div>
    </header>
  )
}
