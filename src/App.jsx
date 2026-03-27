import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GenericPage from './pages/GenericPage'
import TermsOfTradePage from './pages/TermsOfTradePage'
import PrivacyLegalPoliciesPage from './pages/PrivacyLegalPoliciesPage'
import PaymentTermsPage from './pages/PaymentTermsPage'
import InsuranceCoverPage from './pages/InsuranceCoverPage'
import FAQPage from './pages/FAQPage'
import NewZealandHolidaysPage from './pages/NewZealandHolidaysPage'
import CarsPage from './pages/CarsPage'
import CarDetailPage from './pages/CarDetailPage'
import ProductCategoryPage from './pages/ProductCategoryPage'
import LocationsPage from './pages/LocationsPage'
import AucklandAirportPage from './pages/AucklandAirportPage'
import { RedirectCategoryToProductCategory } from './pages/LegacyFleetRedirects'
import { roadHero } from './data/pageHeros'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="cars/intermediate-suv-4wd"
          element={<Navigate to="/cars/suv-4wd2wd/" replace />}
        />
        <Route
          path="cars/supersaver-people-mover"
          element={<Navigate to="/cars/budget-people-mover/" replace />}
        />
        <Route
          path="cars/large-people-mover"
          element={<Navigate to="/cars/luxury-people-mover/" replace />}
        />
        <Route path="cars/:carSlug" element={<CarDetailPage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="product-category/:slug" element={<ProductCategoryPage />} />
        <Route path="category/:slug" element={<RedirectCategoryToProductCategory />} />
        <Route path="location" element={<LocationsPage />} />
        <Route path="auckland-airport" element={<AucklandAirportPage />} />
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
        <Route path="faq" element={<FAQPage />} />
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
        <Route path="new-zealand-holidays" element={<NewZealandHolidaysPage />} />
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
        <Route path="insurance" element={<InsuranceCoverPage />} />
        <Route path="payment-terms" element={<PaymentTermsPage />} />
        <Route path="privacy-legal-policies" element={<PrivacyLegalPoliciesPage />} />
        <Route path="terms-of-trade" element={<TermsOfTradePage />} />
      </Route>
    </Routes>
  )
}
