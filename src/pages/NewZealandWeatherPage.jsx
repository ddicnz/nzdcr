import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import body from '../content/new-zealand-weather-body.html?raw'

export default function NewZealandWeatherPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('NEW ZEALAND WEATHER', 'New Zealand Weather')} />
      <div
        className="terms-prose nz-holidays-page nz-weather-page container"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </>
  )
}
