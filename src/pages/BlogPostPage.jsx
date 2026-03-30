import { Suspense, lazy } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import { getBlogPost } from '../data/blogPosts'
import { ROAD_HERO_IMG } from '../data/pageHeros'

const BlogPostMap = lazy(() => import('../components/BlogPostMap'))

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getBlogPost(slug) : null

  if (!post) {
    return <Navigate to="/our-blog/" replace />
  }

  return (
    <>
      <PageHeroBanner
        heading={post.heroHeading}
        imageSrc={post.coverImage ?? ROAD_HERO_IMG}
        breadcrumbs={[
          { label: 'Our Blog', to: '/our-blog/' },
          { label: post.title },
        ]}
      />
      {post.blogMap ? (
        <div className="blog-post-map-outer">
          <Suspense
            fallback={<div className="blog-post-map__leaflet blog-post-map__leaflet--loading" aria-hidden />}
          >
            <BlogPostMap blogMap={post.blogMap} />
          </Suspense>
        </div>
      ) : null}
      <div
        className="terms-prose blog-page blog-post-page location-detail-page container"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />
    </>
  )
}
