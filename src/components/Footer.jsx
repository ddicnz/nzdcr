import { Link } from 'react-router-dom'

function SocialLinks({ className = '' }) {
  return (
    <div className={`social-links ${className}`}>
      <a href="#" aria-label="Facebook">f</a>
      <a href="#" aria-label="Twitter">𝕏</a>
      <a href="#" aria-label="Google+">G+</a>
      <a href="#" aria-label="Pinterest">P</a>
      <a href="#" aria-label="Yelp">Y</a>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>Stay with us</h4>
          <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="footer-email" className="sr-only">Email</label>
            <input id="footer-email" type="email" placeholder="Email" />
            <button type="submit" className="btn btn--primary btn--sm">Subscribe</button>
          </form>
          <SocialLinks className="footer-social" />
        </div>
        <div>
          <h4>Contact us</h4>
          <ul className="footer-phones">
            <li><strong>NZ:</strong> <a href="tel:080017951795">0800 1795 1795</a></li>
            <li><strong>AU:</strong> <a href="tel:1800302162">1800 302 162</a></li>
            <li><strong>UK:</strong> <a href="tel:08002425635">0800 242 5635</a></li>
          </ul>
        </div>
        <div className="footer-brand">
          <h4>New Zealand Discount car rentals</h4>
          <p className="footer-address">
            3 Verissimo Drive, Mangere, Manukau, Auckland 2022
          </p>
          <p>phone: <a href="tel:096882299">09 688 2299</a>, <a href="tel:080017951795">0800 1795 1795</a></p>
        </div>
      </div>
      <div className="footer-links-bar">
        <div className="container footer-links">
          <Link to="/customer-feedback/">Customer Feedback</Link>
          <Link to="/faq/">FAQ</Link>
          <a href="#">Insurance Cover</a>
          <a href="#">Payment terms</a>
          <a href="#">Privacy & Legal Policies</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
      <p className="footer-copy">All rights reserved — NZ Discount Car Rentals</p>
    </footer>
  )
}
