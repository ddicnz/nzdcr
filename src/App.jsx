import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GenericPage from './pages/GenericPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<GenericPage title="Fleet" />} />
        <Route path="location" element={<GenericPage title="Locations" />} />
        <Route path="auckland-airport" element={<GenericPage title="Auckland Airport" />} />
        <Route path="christchurch-airport" element={<GenericPage title="Christchurch Airport" />} />
        <Route path="queenstown-airport" element={<GenericPage title="Queenstown Airport" />} />
        <Route path="waiheke-island" element={<GenericPage title="Waiheke Island" />} />
        <Route path="cars-for-sale" element={<GenericPage title="Cars for Sale" />} />
        <Route path="faq" element={<GenericPage title="FAQ" />} />
        <Route path="our-blog" element={<GenericPage title="Our Blog" />} />
        <Route path="customer-feedback" element={<GenericPage title="Customer Feedback" />} />
        <Route path="about-nz" element={<GenericPage title="Visit New Zealand" />} />
        <Route path="new-zealand-holidays" element={<GenericPage title="New Zealand Holidays" />} />
        <Route path="new-zealand-weather" element={<GenericPage title="New Zealand Weather" />} />
        <Route path="new-zealand-activities" element={<GenericPage title="New Zealand Activities" />} />
        <Route path="about-us" element={<GenericPage title="About Us" />} />
        <Route path="contact-us" element={<GenericPage title="Contact Us" />} />
        <Route path="hotdeal" element={<GenericPage title="Hot Deals" />} />
      </Route>
    </Routes>
  )
}
