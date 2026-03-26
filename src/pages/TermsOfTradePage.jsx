import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import termsBody from '../content/terms-of-trade-body.html?raw'

export default function TermsOfTradePage() {
  return (
    <>
      <PageHeroBanner {...roadHero('TERMS & CONDITIONS', 'Terms & Conditions')} />
      <div
        className="terms-prose container"
        dangerouslySetInnerHTML={{ __html: termsBody }}
      />
    </>
  )
}
