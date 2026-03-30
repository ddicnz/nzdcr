import { Link } from 'react-router-dom'
import HomeHeroBanner from '../components/HomeHeroBanner'
import FleetGrid from '../components/FleetGrid'
import { getBlogPostsSorted } from '../data/blogPosts'

const HOME_BLOG_LIMIT = 6

const HOME_TESTIMONIALS = [
  {
    initial: 'C',
    name: 'Chris & Elaine',
    subtitle: 'Queenstown',
    text: "My husband and I recently visited New Zealand for the first time from American Samoa. Our flights arrived and left from Auckland Airport at crazy times of the night, and it was difficult to find a rental car company that didn't charge exorbitant prices for after hour pick up and drop off.\n\nNZ Discount Car Rentals were amazing. They teamed up with Aeroparks, an airport car park, and they pick you up in a shuttle 24/7 to take you to your rental car. It was as smooth as smooth can be!\n\nWe also chose NZ Discount Rentals because they offered great prices on GPS units, and we wanted our trip to be as stress free as possible. Communicating with the company was easier, and we were always treated with respect and courtesy. We would definitely rent here again and will recommend to all of our friends traveling to New Zealand.",
  },
  {
    initial: 'H',
    name: 'Helen Monson',
    text: 'After finding NZ Discount Car Rentals in 2008 I have constantly found them to be superior on price and service to all other vehicle rental companies I have looked at since then. You would imagine that to be cheaper than their opposition they would sacrifice some other part of their service, but that is not my experience.\n\nNZ Discount Car Rentals have, by far, the best service you could ask for. They have even swapped a vehicle I had been using which did not suit the needs of my family, to one that did. I no longer look at booking with any other rental company. I have found their competitors to be up to twice the cost and because I cannot fault their service it does not make sense for me to look elsewhere anymore. Since 2008 I have booked with NZ Discount Car Rentals on about 5 occasions. Happily a repeat customer.',
  },
  {
    initial: 'K',
    name: 'Ken Leaming',
    text: "Hi Jo,\n\nSorry we haven't been in touch but been quite busy, just a quick note to say how much we appreciate your great service, as visitors from Great Barrier Island it is so good to get into Auckland and be able to get picked up from Auckland airport and taken to your depot to pick up our rental car, makes things so much easier for us and no hassle to you. With a wide range of vehicles to choose from, modern, clean, comfortable, reliable and very reasonably priced. Every time we are in Auckland we are happy to use your company, and are so impressed with you and your staff, we recommend you to all on the island. Makes our trips to Auckland hassle free. Thanks again, and we wish you well for the future.",
  },
]

function TeaserStrip() {
  return (
    <section className="teaser-strip">
      <div className="container teaser-grid">
        <article className="teaser-card">
          <h3>Locations</h3>
          <div className="teaser-card__map-wrap">
            <img
              className="teaser-card__map"
              src="/pic/homepage/locations-nz-map.png"
              alt="NZ Discount Car Rentals branches in Auckland, Christchurch, and Queenstown on a map of New Zealand"
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </div>
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

function HomeSocialProofSection() {
  return (
    <section className="home-social-proof" aria-label="Customer reviews and repeat business">
      <div className="container">
        <div className="home-repeat-stat__wrap">
          <p className="home-repeat-stat__text">58% of our business last year was from Repeat Clients.</p>
        </div>
        <ul className="home-testimonials">
          {HOME_TESTIMONIALS.map((item) => (
            <li key={item.name} className="home-testimonial">
              <div className="home-testimonial__head">
                <span className="home-testimonial__avatar" aria-hidden>
                  {item.initial}
                </span>
                <div className="home-testimonial__name-block">
                  <p className="home-testimonial__name">{item.name}</p>
                  {item.subtitle ? (
                    <p className="home-testimonial__subtitle">{item.subtitle}</p>
                  ) : null}
                </div>
              </div>
              <div className="home-testimonial__rule" aria-hidden />
              <p className="home-testimonial__stars" aria-label="5 out of 5 stars">
                <span aria-hidden>★★★★★</span>
              </p>
              <div className="home-testimonial__text">
                {item.text.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>
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
