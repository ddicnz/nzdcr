import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import body from '../content/visit-new-zealand-body.html?raw'

export default function VisitNewZealandPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('VISIT NEW ZEALAND', 'Visit New Zealand')} />
      <div
        className="terms-prose nz-holidays-page container"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </>
  )
}
