import { useState } from 'react'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <nav className="container navbar__inner" aria-label="Primary">
        <a href="#top" className="navbar__brand" onClick={close}>
          Preston<span className="navbar__brand-dot">&nbsp;</span>Gray
        </a>

        <button
          type="button"
          className={`navbar__toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <div className={`navbar__menu${open ? ' is-open' : ''}`}>
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--primary btn--sm" onClick={close}>
            Let&rsquo;s Talk
          </a>
        </div>
      </nav>
    </header>
  )
}
