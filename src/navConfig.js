/** Main nav: paths match NZDCR-style URLs (with optional trailing slash in browser). */
export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Fleet',
    to: '/cars/',
    children: [
      { label: 'Compact', to: '/product-category/hatches/' },
      { label: 'Intermediate', to: '/product-category/intermediate/' },
      { label: 'Station Wagon', to: '/product-category/station-wagon/' },
      { label: 'SUV', to: '/product-category/suv/' },
      { label: 'People Mover', to: '/product-category/people-mover/' },
    ],
  },
  {
    label: 'Locations',
    to: '/location/',
    children: [
      { label: 'Auckland Airport', to: '/auckland-airport/' },
      { label: 'Christchurch Airport', to: '/christchurch-airport/' },
      { label: 'Queenstown Airport', to: '/queenstown-airport/' },
    ],
  },
  { label: 'Cars for Sale', to: '/cars-for-sale/' },
  {
    label: 'Travel Help',
    to: '/faq/',
    children: [
      { label: 'FAQ', to: '/faq/' },
      { label: 'Blog', to: '/our-blog/' },
      { label: 'Customer Feedback', to: '/customer-feedback/' },
    ],
  },
  {
    label: 'Visit NZ',
    to: '/about-nz/',
    children: [
      { label: 'NZ Holidays', to: '/new-zealand-holidays/' },
      { label: 'NZ Weather', to: '/new-zealand-weather/' },
      { label: 'NZ Activities', to: '/new-zealand-activities/' },
      {
        label: 'DriveSafe',
        to: 'https://www.drivesafe.org.nz/',
        external: true,
      },
    ],
  },
  {
    label: 'About us',
    to: '/about-us/',
    children: [
      { label: 'About us', to: '/about-us/' },
      { label: 'Contact', to: '/contact-us/' },
    ],
  },
  { label: 'Hot Deals', to: '/hotdeal/' },
]
