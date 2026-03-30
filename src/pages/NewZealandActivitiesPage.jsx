import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import body from '../content/new-zealand-activities-body.html?raw'

export default function NewZealandActivitiesPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('NEW ZEALAND ACTIVITIES', 'New Zealand Activities')} />
      <div
        className="terms-prose nz-holidays-page nz-activities-page location-detail-page container"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </>
  )
}
