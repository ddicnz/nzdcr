import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import insuranceBody from '../content/insurance-body.html?raw'

export default function InsuranceCoverPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('INSURANCE COVER', 'Insurance Cover')} />
      <div
        className="terms-prose insurance-page container"
        dangerouslySetInnerHTML={{ __html: insuranceBody }}
      />
    </>
  )
}
