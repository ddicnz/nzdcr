import { CUSTOMER_TESTIMONIALS } from '../data/customerTestimonials'

export default function CustomerTestimonialsList() {
  return (
    <ul className="home-testimonials">
      {CUSTOMER_TESTIMONIALS.map((item) => (
        <li key={item.name} className="home-testimonial">
          <div className="home-testimonial__head">
            <span className="home-testimonial__avatar" aria-hidden>
              {item.initial}
            </span>
            <div className="home-testimonial__name-block">
              <p className="home-testimonial__name">{item.name}</p>
              {item.subtitle ? (
                <p className="home-testimonial__subtitle">{item.subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="home-testimonial__rule" aria-hidden />
          <p className="home-testimonial__stars" aria-label="5 out of 5 stars">
            <span aria-hidden>★★★★★</span>
          </p>
          <div className="home-testimonial__text">
            {item.text.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
