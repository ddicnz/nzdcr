import { Link } from 'react-router-dom'
import HomeHeroBanner from '../components/HomeHeroBanner'
import FleetGrid from '../components/FleetGrid'
import CustomerTestimonialsList from '../components/CustomerTestimonialsList'
import { getBlogPostsSorted } from '../data/blogPosts'

const HOME_BLOG_LIMIT = 6

function TeaserStrip() {
  return (
    <section className="teaser-strip">
      <div className="container teaser-grid">
        <article className="teaser-card">
          <h3>Locations</h3>
          <p>
            We have three rental locations across New Zealand &mdash; Auckland, Christchurch, and Queenstown.
          </p>
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
            we offer the best value on all our rentals starting at just $19.95 a day*.
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

function HomeSocialProofSection() {
  return (
    <section className="home-social-proof" aria-label="Customer reviews and repeat business">
      <div className="container">
        <div className="home-repeat-stat__wrap">
          <p className="home-repeat-stat__text">58% of our business last year was from Repeat Clients.</p>
        </div>
        <CustomerTestimonialsList />
      </div>
    </section>
  )
}

function HomeBlogSection() {
  const posts = getBlogPostsSorted().slice(0, HOME_BLOG_LIMIT)

  return (
    <section className="home-blog" aria-labelledby="home-blog-heading">
      <div className="container">
        <h2 id="home-blog-heading" className="home-blog__title">
          Our Travel Blogs
        </h2>
        <ul className="blog-index__grid home-blog__grid">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="blog-card" to={`/our-blog/${post.slug}/`}>
                <div className="blog-card__media">
                  <img
                    src={post.coverImage}
                    alt=""
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="blog-card__body">
                  <p className="blog-card__meta">
                    {post.category ? (
                      <>
                        <span className="blog-card__category">{post.category}</span>
                        <span aria-hidden> · </span>
                      </>
                    ) : null}
                    <time dateTime={post.dateSort}>{post.dateLabel}</time>
                  </p>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <span className="blog-card__more">Read more</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
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
      <HomeSocialProofSection />
      <HomeBlogSection />
    </div>
  )
}
