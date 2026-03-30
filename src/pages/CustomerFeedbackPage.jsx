import PageHeroBanner from '../components/PageHeroBanner'
import CustomerTestimonialsList from '../components/CustomerTestimonialsList'
import { roadHero } from '../data/pageHeros'

export default function CustomerFeedbackPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('CUSTOMER FEEDBACK', 'Customer Feedback')} />
      <section className="customer-feedback-reviews" aria-label="Customer reviews">
        <div className="container">
          <CustomerTestimonialsList />
        </div>
      </section>
    </>
  )
}
