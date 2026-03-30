import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import { CONTACT_FORM_SUBMIT_URL } from '../data/contactForm'
import { roadHero } from '../data/pageHeros'

export default function ContactUsPage() {
  const [searchParams] = useSearchParams()
  const sent = searchParams.get('sent') === '1'
  const [nextUrl, setNextUrl] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  useEffect(() => {
    setNextUrl(`${window.location.origin}/contact-us/?sent=1`)
  }, [])

  const onSubmit = (e) => {
    if (String(captcha).trim() !== '0') {
      e.preventDefault()
      setCaptchaError(true)
      return
    }
    setCaptchaError(false)
  }

  return (
    <>
      <PageHeroBanner {...roadHero('CONTACT US', 'Contact Us')} />
      <div className="terms-prose nz-holidays-page contact-page container">
        {sent ? (
          <p className="contact-page__sent" role="status">
            Thank you — your message has been sent. We will get back to you as soon as we can.
          </p>
        ) : null}

        <div className="contact-page__layout">
          <div className="contact-page__main">
            <p>
              Our offices are within minutes from Auckland, Christchurch and Queenstown Airports. We offer a free
              shuttle service from airports and within 2kms of airport motel/hotel to our office.
            </p>

            <h2>NZ Discount Car Rentals</h2>

            <h3>Address</h3>
            <div className="contact-addresses">
              <div className="contact-addresses__branch">
                <p>
                  <strong>Auckland Branch</strong>
                  <br />
                  3 Verissimo Drive
                  <br />
                  Mangere
                  <br />
                  Auckland 2022
                  <br />
                  New Zealand
                </p>
              </div>
              <div className="contact-addresses__branch">
                <p>
                  <strong>Christchurch Branch</strong>
                  <br />
                  153 Orchard Road
                  <br />
                  Harewood
                  <br />
                  Christchurch 8051
                  <br />
                  New Zealand
                </p>
              </div>
              <div className="contact-addresses__branch">
                <p>
                  <strong>Queenstown Branch</strong>
                  <br />
                  121 Glenda Drive
                  <br />
                  Frankton
                  <br />
                  Queenstown, 9300
                  <br />
                  New Zealand
                </p>
              </div>
            </div>

            <h3>Phone</h3>
            <ul>
              <li>
                <strong>From NZ:</strong>{' '}
                <a href="tel:080017951795">0800 1795 1795</a>
              </li>
              <li>
                <strong>From Australia:</strong>{' '}
                <a href="tel:1800302162">1800 302 162</a>
              </li>
              <li>
                <strong>From UK:</strong>{' '}
                <a href="tel:08002425635">0800 242 5635</a>
              </li>
              <li>
                <strong>Rest of the World:</strong>
                <ul>
                  <li>
                    Auckland <a href="tel:+6496882299">(+64) 9 688 2299</a>;{' '}
                    <a href="tel:+6492754085">(+64) 9 275 4085</a>
                  </li>
                  <li>
                    Christchurch <a href="tel:+6439743818">(+64) 3 974 3818</a>
                  </li>
                  <li>
                    Queenstown <a href="tel:+6439743819">(+64) 3 974 3819</a>
                  </li>
                </ul>
              </li>
            </ul>

            <h3>Opening hours</h3>
            <p>
              <strong>All branches:</strong>
            </p>
            <ul>
              <li>
                <strong>Monday to Sunday:</strong> 9:00am – 5:00pm
              </li>
              <li>
                <strong>Public holidays:</strong> We are only closed on Christmas day.
              </li>
              <li>
                <strong>After hours services:</strong> Available for pick up/drop off (cost may apply).
              </li>
            </ul>
          </div>

          <aside className="contact-page__aside" aria-label="Email enquiry form">
            <h2 className="contact-page__aside-title">Email us</h2>
            <form
              className="contact-form"
              action={CONTACT_FORM_SUBMIT_URL}
              method="POST"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="_subject" value="NZDCR website — Contact form" />
              {nextUrl ? <input type="hidden" name="_next" value={nextUrl} /> : null}
              <input type="text" name="_gotcha" autoComplete="off" tabIndex={-1} className="contact-form__hp" aria-hidden="true" />

              <div className="contact-form__field">
                <label htmlFor="contact-name">Your name *</label>
                <input id="contact-name" name="name" type="text" required autoComplete="name" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-email">Email *</label>
                <input id="contact-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-phone">Phone number *</label>
                <input id="contact-phone" name="phone" type="tel" required autoComplete="tel" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" name="message" required rows={6} />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-captcha">Just to prove you are a human, please solve the equation: 4 − 4</label>
                <input
                  id="contact-captcha"
                  type="text"
                  inputMode="numeric"
                  value={captcha}
                  onChange={(e) => {
                    setCaptcha(e.target.value)
                    setCaptchaError(false)
                  }}
                  autoComplete="off"
                  aria-invalid={captchaError}
                  aria-describedby={captchaError ? 'contact-captcha-error' : undefined}
                />
                {captchaError ? (
                  <span id="contact-captcha-error" className="contact-form__error">
                    Please enter the correct answer (0).
                  </span>
                ) : null}
              </div>
              <button type="submit" className="contact-form__submit">
                Send message
              </button>
            </form>

            <p className="contact-page__form-note">
              Submissions are delivered by{' '}
              <a href="https://formsubmit.co/" target="_blank" rel="noopener noreferrer">
                FormSubmit
              </a>
              . The first time this address receives a form, you may need to confirm the link in the email from
              FormSubmit.
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}
