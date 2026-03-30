import { Link } from 'react-router-dom'
import HomeHeroBanner from '../components/HomeHeroBanner'
import FleetGrid from '../components/FleetGrid'

function TeaserStrip() {
  return (
    <section className="teaser-strip">
      <div className="container teaser-grid">
        <article className="teaser-card">
          <h3>Locations</h3>
          <Link to="/location/" className="teaser-card__more">
            View More →
          </Link>
        </article>
        <article className="teaser-card teaser-card--accent">
          <h3>Hot Deal</h3>
          <p>Get the cheapest car rental prices for your trip</p>
          <Link to="/hotdeal/" className="teaser-card__more">
            View More →
          </Link>
        </article>
        <article className="teaser-card">
          <h3>We Care…</h3>
          <p>
            If you&apos;re looking for a rental car in Auckland offering great value, high quality
            and total peace-of-mind, you&apos;ve come to the right place. At NZ Discount Car Rentals,
            we offer the best value on all our rentals starting at just $9.95 a day*.
          </p>
          <Link to="/about-us/" className="teaser-card__more">
            View More →
          </Link>
        </article>
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section className="hero-main">
      <div className="container">
        <h2 className="hero-main__title">WE HAVE THE BEST CAR YOU NEED IN NEW ZEALAND</h2>
        <p className="hero-main__lead">
          Whether it&apos;s fast pace or boot space you&apos;re after, we have just the right car for you.
        </p>
        <p className="hero-main__sub">
          Browse through our wide car rental range in Auckland and Christchurch today and you could
          be driving off on your next adventure tomorrow.
        </p>
      </div>
    </section>
  )
}

function HomeFleetSection() {
  return (
    <section className="fleet-section">
      <FleetGrid withSection={false} />
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeHeroBanner />
      <TeaserStrip />
      <Hero />
      <HomeFleetSection />
    </div>
  )
}
