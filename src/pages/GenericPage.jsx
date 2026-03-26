import PageHeroBanner from '../components/PageHeroBanner'

/** @param {{ title: string, hero?: { heading: string, breadcrumbLast: string, imageSrc?: string } }} props */
export default function GenericPage({ title, hero }) {
  return (
    <>
      {hero ? (
        <PageHeroBanner
          heading={hero.heading}
          breadcrumbLast={hero.breadcrumbLast}
          imageSrc={hero.imageSrc}
        />
      ) : null}
      <div className="page-generic container">
        {!hero ? <h1 className="page-generic__title">{title}</h1> : null}
        <p className="page-generic__lead">
          This page is under construction. Content will match the live NZDCR site.
        </p>
      </div>
    </>
  )
}
