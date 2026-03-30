import { Fragment } from 'react'
import { Link } from 'react-router-dom'

const DEFAULT_HERO_IMG = '/pic/new-zealand-road.jpg'

/**
 * Full-width title strip over a road photo (policy / legal pages).
 * @param {{ label: string, to?: string }} BreadcrumbItem
 */
export default function PageHeroBanner({
  heading,
  breadcrumbLast,
  /** @type {BreadcrumbItem[] | undefined} If set, replaces the single `breadcrumbLast` crumb after Home. */
  breadcrumbs,
  imageSrc = DEFAULT_HERO_IMG,
}) {
  const trail =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : [{ label: breadcrumbLast ?? '' }]

  return (
    <section
      className="page-hero"
      style={{ '--page-hero-image': `url("${imageSrc}")` }}
      aria-labelledby="page-hero-title"
    >
      <div className="page-hero__overlay" aria-hidden />
      <div className="page-hero__inner">
        <h1 id="page-hero-title" className="page-hero__title">
          {heading}
        </h1>
        <p className="page-hero__crumb">
          <Link to="/">Home</Link>
          {trail.map((crumb, i) => (
            <Fragment key={`${crumb.label}-${i}`}>
              <span className="page-hero__crumb-sep" aria-hidden>
                {' '}
                &gt;{' '}
              </span>
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
