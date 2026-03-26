import { Link } from 'react-router-dom'
import HomeHeroBanner from '../components/HomeHeroBanner'
import FleetGrid from '../components/FleetGrid'

function TeaserStrip() {
  return (
    <section className="teaser-strip">
      <div className="container teaser-grid">
        <article className="teaser-card">
          <h3>Locations</h3>
          <Link to="/location/" className="teaser-card__more">View More →</Link>
        </article>
        <article className="teaser-card teaser-card--accent">
          <h3>Hot Deal</h3>
          <p>Get the cheapest car rental prices for your trip</p>
          <Link to="/hotdeal/" className="teaser-card__more">View More →</Link>
        </article>
        <article className="teaser-card">
          <h3>We Care…</h3>
          <p>
            If you&apos;re looking for a rental car in Auckland offering great value, high quality
            and total peace-of-mind, you&apos;ve come to the right place. At NZ Discount Car Rentals,
            we offer the best value on all our rentals starting at just $9.95 a day*.
          </p>
          <Link to="/about-us/" className="teaser-card__more">View More →</Link>
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
      <div className="container fleet-cta-row">
        <Link to="/cars/" className="btn btn--outline">SEE ALL OUR CARS</Link>
        <Link to="/hotdeal/" className="btn btn--primary">DISCOUNT OFFERS</Link>
      </div>
    </section>
  )
}

function TestimonialBlock() {
  return (
    <section className="testimonial-strip">
      <div className="container">
        <p className="repeat-stat">
          <strong>58%</strong> of our business last year was from Repeat Clients.
        </p>
        <blockquote className="quote">
          <p>
            NZ Discount Car Rentals have, by far, the best service you could ask for. They have even
            swapped a vehicle I had been using, which did not suit the needs of my family, to one that did.
          </p>
          <cite>Ken Leaming — A satisfied and loyal customer</cite>
        </blockquote>
      </div>
    </section>
  )
}

function BottomCta() {
  return (
    <section className="bottom-cta">
      <div className="container bottom-cta__inner">
        <h3>Why wait? Book your ideal car today.</h3>
        <p>From only $9.95 a day*</p>
        <Link to="/hotdeal/" className="btn btn--primary btn--lg">Book Now !</Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HomeHeroBanner />
      <TeaserStrip />
      <Hero />
      <HomeFleetSection />
      <TestimonialBlock />
      <BottomCta />
    </>
  )
}
