import { Link } from 'react-router-dom'

function IconEnvelope() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16V11h-1c-1 0-1.3.62-1.3 1.26V15h2.2l-.35 3H13v6.95c4.56-.93 8-4.97 8-9.75z"
      />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

function IconGooglePlus() {
  return (
    <span className="footer-social-gplus" aria-hidden>
      G+
    </span>
  )
}

const FOOTER_SOCIAL = [
  {
    label: 'Email',
    href: 'mailto:booking@nzdcr.co.nz',
    external: false,
    className: 'footer-social-link--mail',
    icon: <IconEnvelope />,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nzdcr/?fref=ts#',
    external: true,
    className: 'footer-social-link--facebook',
    icon: <IconFacebook />,
  },
  {
    label: 'Twitter',
    href: 'https://x.com/NZDCR',
    external: true,
    className: 'footer-social-link--twitter',
    icon: <IconTwitter />,
  },
  {
    label: 'Google+',
    href: 'https://www.google.com/search?q=NZ+Discount+Car+Rentals',
    external: true,
    className: 'footer-social-link--google',
    icon: <IconGooglePlus />,
  },
]

function FooterSocial() {
  return (
    <div className="footer-social-row">
      {FOOTER_SOCIAL.map(({ label, href, external, className, icon }) => (
        <a
          key={label}
          href={href}
          className={`footer-social-link ${className}`}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Stay with us</h4>
            <FooterSocial />
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Contact us</h4>
            <ul className="footer-phones">
              <li>
                <span className="footer-phone-prefix">NZ:</span>{' '}
                <a href="tel:080017951795" className="footer-phone-number">
                  0800 1795 1795
                </a>
              </li>
              <li>
                <span className="footer-phone-prefix">AU:</span>{' '}
                <a href="tel:1800302162" className="footer-phone-number">
                  1800 302 162
                </a>
              </li>
              <li>
                <span className="footer-phone-prefix">UK:</span>{' '}
                <a href="tel:08002425635" className="footer-phone-number">
                  0800 242 5635
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col--brand">
            <h4 className="footer-heading">New Zealand Discount car rentals</h4>
            <p className="footer-brand-lines">
              New Zealand Discount Car Rentals
              <br />
              3 Verissimo Drive, Mangere, Manukau, Auckland 2022
              <br />
              phone:{' '}
              <a href="tel:096882299">09 688 2299</a>,{' '}
              <a href="tel:080017951795">0800 1795 1795</a>
            </p>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="footer-copy">All right reserved - NZ Discount Car Rentals</p>
          <nav className="footer-links" aria-label="Legal and help">
            <Link to="/customer-feedback/">Customer Feedback</Link>
            <Link to="/faq/">FAQ</Link>
            <Link to="/insurance/">Insurance Cover</Link>
            <Link to="/payment-terms/">Payment terms</Link>
            <Link to="/privacy-legal-policies/">Privacy &amp; Legal Policies</Link>
            <Link to="/terms-of-trade/">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>

      <button type="button" className="footer-back-top" onClick={scrollTop} aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </button>
    </footer>
  )
}
