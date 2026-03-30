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
import NewZealandWeatherPage from './pages/NewZealandWeatherPage'
import NewZealandActivitiesPage from './pages/NewZealandActivitiesPage'
import AboutUsPage from './pages/AboutUsPage'
import ContactUsPage from './pages/ContactUsPage'
import OurBlogPage from './pages/OurBlogPage'
import BlogPostPage from './pages/BlogPostPage'
import CarsPage from './pages/CarsPage'
import CarDetailPage from './pages/CarDetailPage'
import ProductCategoryPage from './pages/ProductCategoryPage'
import LocationsPage from './pages/LocationsPage'
import AucklandAirportPage from './pages/AucklandAirportPage'
import ChristchurchAirportPage from './pages/ChristchurchAirportPage'
import QueenstownAirportPage from './pages/QueenstownAirportPage'
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
        <Route path="christchurch-airport" element={<ChristchurchAirportPage />} />
        <Route path="queenstown-airport" element={<QueenstownAirportPage />} />
        <Route path="waiheke-island" element={<Navigate to="/location/" replace />} />
        <Route
          path="cars-for-sale"
          element={<GenericPage title="Cars for Sale" hero={roadHero('CARS FOR SALE', 'Cars for Sale')} />}
        />
        <Route path="faq" element={<FAQPage />} />
        <Route
          path="our-blog/10-things-to-do-in-auckland-part-1"
          element={<Navigate to="/our-blog/10-things-to-do-in-auckland/" replace />}
        />
        <Route path="our-blog/:slug" element={<BlogPostPage />} />
        <Route path="our-blog" element={<OurBlogPage />} />
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
        <Route path="new-zealand-weather" element={<NewZealandWeatherPage />} />
        <Route path="new-zealand-activities" element={<NewZealandActivitiesPage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="contact-us" element={<ContactUsPage />} />
        <Route path="hotdeal" element={<GenericPage title="Hot Deals" hero={roadHero('HOT DEALS', 'Hot Deals')} />} />
        <Route path="insurance" element={<InsuranceCoverPage />} />
        <Route path="payment-terms" element={<PaymentTermsPage />} />
        <Route path="privacy-legal-policies" element={<PrivacyLegalPoliciesPage />} />
        <Route path="terms-of-trade" element={<TermsOfTradePage />} />
      </Route>
    </Routes>
  )
}
