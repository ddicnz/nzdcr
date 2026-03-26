import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import FleetGrid from '../components/FleetGrid'
import FleetCategoryNav from '../components/FleetCategoryNav'
import FleetSortBar from '../components/FleetSortBar'
import { roadHero } from '../data/pageHeros'
import { FLEET } from '../data/fleet'
import { migrateSearchParamsToOrderby, sortFleetItems } from '../data/fleetSort'

export default function CarsPage() {
  const [searchParams] = useSearchParams()
  const orderbyParam = searchParams.get('orderby')
  const sorted = useMemo(() => sortFleetItems(FLEET, orderbyParam), [orderbyParam])

  if (searchParams.get('sort')) {
    const next = migrateSearchParamsToOrderby(searchParams)
    const qs = next.toString()
    return <Navigate to={qs ? `/cars/?${qs}` : '/cars/'} replace />
  }

  return (
    <>
      <PageHeroBanner {...roadHero('CARS TO HIRE', 'Cars to hire')} />
      <div className="cars-page">
        <div className="container">
          <header className="cars-page__intro">
            <p>
              If you&apos;ve got a car in mind you&apos;d like to hire in Auckland, chances are we have
              it on our list. Browse through our wide range and hire the car which best suits your
              driving needs. All of our cars come with a <strong>free 24-hour Breakdown Service.</strong>{' '}
              We also offer a <strong>shuttle service</strong> from Auckland Airport or any Airport
              Motel/Hotel to our office.
            </p>
            <h2 className="cars-page__list-title">Here&rsquo;s a list of all the rental cars we currently have available.</h2>
            <FleetCategoryNav activeSlug={null} />
            <FleetSortBar resultLine={`Showing all ${FLEET.length} results`} />
          </header>
        </div>
        <FleetGrid items={sorted} />
      </div>
    </>
  )
}
