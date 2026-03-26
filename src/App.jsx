import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GenericPage from './pages/GenericPage'
import TermsOfTradePage from './pages/TermsOfTradePage'
import { roadHero } from './data/pageHeros'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<GenericPage title="Fleet" hero={roadHero('FLEET', 'Fleet')} />} />
        <Route
          path="location"
          element={<GenericPage title="Locations" hero={roadHero('LOCATIONS', 'Locations')} />}
        />
        <Route
          path="auckland-airport"
          element={
            <GenericPage title="Auckland Airport" hero={roadHero('AUCKLAND AIRPORT', 'Auckland Airport')} />
          }
        />
        <Route
          path="christchurch-airport"
          element={
            <GenericPage
              title="Christchurch Airport"
              hero={roadHero('CHRISTCHURCH AIRPORT', 'Christchurch Airport')}
            />
          }
        />
        <Route
          path="queenstown-airport"
          element={
            <GenericPage
              title="Queenstown Airport"
              hero={roadHero('QUEENSTOWN AIRPORT', 'Queenstown Airport')}
            />
          }
        />
        <Route
          path="waiheke-island"
          element={<GenericPage title="Waiheke Island" hero={roadHero('WAIHEKE ISLAND', 'Waiheke Island')} />}
        />
        <Route
          path="cars-for-sale"
          element={<GenericPage title="Cars for Sale" hero={roadHero('CARS FOR SALE', 'Cars for Sale')} />}
        />
        <Route path="faq" element={<GenericPage title="FAQ" hero={roadHero('FAQ', 'FAQ')} />} />
        <Route path="our-blog" element={<GenericPage title="Our Blog" hero={roadHero('OUR BLOG', 'Our Blog')} />} />
        <Route
          path="customer-feedback"
          element={
            <GenericPage
              title="Customer Feedback"
              hero={roadHero('CUSTOMER FEEDBACK', 'Customer Feedback')}
            />
          }
        />
        <Route
          path="about-nz"
          element={
            <GenericPage title="Visit New Zealand" hero={roadHero('VISIT NEW ZEALAND', 'Visit New Zealand')} />
          }
        />
        <Route
          path="new-zealand-holidays"
          element={
            <GenericPage title="New Zealand Holidays" hero={roadHero('NZ HOLIDAYS', 'NZ Holidays')} />
          }
        />
        <Route
          path="new-zealand-weather"
          element={<GenericPage title="New Zealand Weather" hero={roadHero('NZ WEATHER', 'NZ Weather')} />}
        />
        <Route
          path="new-zealand-activities"
          element={
            <GenericPage title="New Zealand Activities" hero={roadHero('NZ ACTIVITIES', 'NZ Activities')} />
          }
        />
        <Route path="about-us" element={<GenericPage title="About Us" hero={roadHero('ABOUT US', 'About Us')} />} />
        <Route
          path="contact-us"
          element={<GenericPage title="Contact Us" hero={roadHero('CONTACT US', 'Contact Us')} />}
        />
        <Route path="hotdeal" element={<GenericPage title="Hot Deals" hero={roadHero('HOT DEALS', 'Hot Deals')} />} />
        <Route
          path="insurance"
          element={<GenericPage title="Insurance Cover" hero={roadHero('INSURANCE COVER', 'Insurance Cover')} />}
        />
        <Route
          path="payment-terms"
          element={<GenericPage title="Payment Terms" hero={roadHero('PAYMENT TERMS', 'Payment Terms')} />}
        />
        <Route
          path="privacy-legal-policies"
          element={
            <GenericPage
              title="Privacy & Legal Policies"
              hero={roadHero('PRIVACY & LEGAL POLICIES', 'Privacy & Legal Policies')}
            />
          }
        />
        <Route path="terms-of-trade" element={<TermsOfTradePage />} />
      </Route>
    </Routes>
  )
}
