import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import privacyBody from '../content/privacy-legal-policies-body.html?raw'

export default function PrivacyLegalPoliciesPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('PRIVACY & LEGAL POLICIES', 'Privacy & Legal Policies')} />
      <div className="terms-prose container" dangerouslySetInnerHTML={{ __html: privacyBody }} />
    </>
  )
}
