import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import faqBody from '../content/faq-body.html?raw'

export default function FAQPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('FAQ', 'FAQ')} />
      <div className="terms-prose faq-page container" dangerouslySetInnerHTML={{ __html: faqBody }} />
    </>
  )
}
