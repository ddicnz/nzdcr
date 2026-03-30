import { Link } from 'react-router-dom'
import SiteSocialCircles from './SiteSocialCircles'

const FOOTER_WHY_CHOOSE = [
  'FREE Airport Shuttle Bus',
  '24/7 Pick up & Drop off',
  'One-way hire available',
  'Cross-island travel supported',
  'Roadside assistance available',
  'Wide range of vehicles',
  'Great customer service',
  'Unlimited Kms',
]

function IconPromoCheck() {
  return (
    <svg className="footer-promo__check-icon" viewBox="0 0 12 10" width="12" height="10" aria-hidden>
      <path
        fill="currentColor"
        d="M4.2 9.1 0 4.9l1.4-1.4 2.8 2.8L10.6 0 12 1.4z"
      />
    </svg>
  )
}

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="site-footer">
      <section className="footer-promo" aria-labelledby="footer-why-heading">
        <div className="container footer-promo__inner">
          <h2 id="footer-why-heading" className="footer-promo__heading">
            Why choose NZ Discount Car Rentals?
          </h2>
          <ul className="footer-promo__grid">
            {FOOTER_WHY_CHOOSE.map((line) => (
              <li key={line} className="footer-promo__item">
                <span className="footer-promo__check" aria-hidden>
                  <IconPromoCheck />
                </span>
                <span className="footer-promo__text">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="site-footer__main">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Stay with us</h4>
            <SiteSocialCircles className="footer-stay-social" />
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
