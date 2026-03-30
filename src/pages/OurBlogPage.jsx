import { Link } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import { getBlogPostsSorted } from '../data/blogPosts'

export default function OurBlogPage() {
  const posts = getBlogPostsSorted()

  return (
    <>
      <PageHeroBanner {...roadHero('OUR BLOG', 'Our Blog')} />
      <section className="blog-index" aria-label="Blog articles">
        <div className="container blog-index__inner">
          <p className="blog-index__lead">
            Travel tips and city guides for New Zealand — things to see, practical ideas, and inspiration for your trip.
            Choose an article below.
          </p>
          <ul className="blog-index__grid">
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
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__more">Read more</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
