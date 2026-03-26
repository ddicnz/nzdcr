import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import paymentBody from '../content/payment-terms-body.html?raw'

export default function PaymentTermsPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('PAYMENT TERMS', 'Payment Terms')} />
      <div className="terms-prose container" dangerouslySetInnerHTML={{ __html: paymentBody }} />
    </>
  )
}
