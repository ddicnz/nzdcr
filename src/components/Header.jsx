import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../navConfig'
import { LOGO_SRC } from '../constants'
import { buildRcmCheckinUrl } from '../data/rcmBooking'
import SiteSocialCircles from './SiteSocialCircles'

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
            <SiteSocialCircles />
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
            href={buildRcmCheckinUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="header-checkin"
          >
            Check-in
          </a>
        </div>
      </div>
    </header>
  )
}
