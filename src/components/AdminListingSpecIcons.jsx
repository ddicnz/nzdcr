const iconProps = {
  width: 18,
  height: 18,
  'aria-hidden': true,
}

export function IconAdminPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...iconProps} {...props}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.25" />
    </svg>
  )
}

export function IconAdminOdometer(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...iconProps} {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5v4.5l2.5 2.5" />
    </svg>
  )
}

export function IconAdminFuel(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...iconProps} {...props}>
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V12h-2" />
      <path d="M18 12h2v-3l-2-2v5zM6 7h8" />
    </svg>
  )
}

export function IconAdminTransmission(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...iconProps} {...props}>
      <path d="M7 4v16M7 4h8a2 2 0 0 1 0 4H7M7 12h6a2 2 0 0 1 0 4H7" />
    </svg>
  )
}

export function IconAdminEngine(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...iconProps} {...props}>
      <path d="M4 13h2l1.5-3H12v6H9.5L8 13H4v4h16v-4h-3.5l-1.5 3H12V10h3.5L17 13h3" />
      <circle cx="7" cy="17" r="1.25" />
      <circle cx="17" cy="17" r="1.25" />
    </svg>
  )
}
