import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import body from '../content/new-zealand-holidays-body.html?raw'

export default function NewZealandHolidaysPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('NZ HOLIDAYS', 'NZ Holidays')} />
      <div
        className="terms-prose nz-holidays-page container"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </>
  )
}
