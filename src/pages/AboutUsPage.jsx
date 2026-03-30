import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import body from '../content/about-us-body.html?raw'

export default function AboutUsPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('ABOUT US', 'About us')} />
      <div
        className="terms-prose nz-holidays-page about-us-page container"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </>
  )
}
