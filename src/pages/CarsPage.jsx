import PageHeroBanner from '../components/PageHeroBanner'
import FleetGrid from '../components/FleetGrid'
import FleetCategoryNav from '../components/FleetCategoryNav'
import { roadHero } from '../data/pageHeros'
import { FLEET } from '../data/fleet'

export default function CarsPage() {
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
            <p className="cars-page__result-count">Showing all {FLEET.length} results</p>
          </header>
        </div>
        <FleetGrid items={FLEET} />
      </div>
    </>
  )
}
