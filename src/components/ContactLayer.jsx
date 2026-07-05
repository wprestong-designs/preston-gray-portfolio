/*
 * ContactLayer (Workstream C) — the contact page as a JOB TICKET: the
 * print-shop intake document. A full-viewport layer (mirrors IndexLayer's
 * inert/focus/ESC pattern) opened from every Contact affordance and from the
 * /#contact hash.
 *
 * Form is primary; a plain visible email is the alternative for form-skeptics.
 * Backend is NETLIFY FORMS: the static form definition lives in index.html
 * (hidden, so Netlify's build detects it — SPA gotcha); this component does a
 * JS POST with the same form-name + a honeypot. Email notification is a
 * Netlify dashboard setting (Forms → notifications).
 *
 * States (all in the system vocabulary): idle form · submitting · success
 * (stamped "TICKET RECEIVED") · error (inline validation, SR-announced, plus a
 * failure fallback that surfaces the mailto with the message preserved so
 * nothing typed is ever lost). Reduced-motion + keyboard/VoiceOver parity.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const FORM_NAME = 'contact-ticket'
const EMAIL = 'hello@preston-gray.com'
const NEEDS = ['Website', 'Brand/Design', 'Print materials', 'Tools/CRM', 'Not sure yet']
const TIMELINE = ['ASAP', 'This quarter', 'Just exploring']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')

export default function ContactLayer({ open, onClose }) {
  const reducedMotion = useReducedMotion()
  const uid = useId()
  const closeRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const successRef = useRef(null)
  const errSummaryRef = useRef(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [business, setBusiness] = useState('')
  const [needs, setNeeds] = useState([])
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [botField, setBotField] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef }

  // Focus the close control when the layer opens (SR announces the dialog).
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  // ESC closes (only meaningful while open).
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // On success, move focus to the confirmation so it is announced + reachable.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const toggleNeed = (n) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Your name, please.'
    if (!email.trim()) e.email = 'An email so I can reply.'
    else if (!EMAIL_RE.test(email.trim())) e.email = "That email doesn't look right."
    if (!message.trim()) e.message = 'Tell me what needs doing.'
    return e
  }

  // Failure fallback: a mailto that carries everything typed, so a network/
  // Netlify failure never loses the ticket. Also shown copyable in the UI.
  const mailtoHref = () => {
    const lines = [
      business && `Business: ${business}`,
      needs.length && `Needs: ${needs.join(', ')}`,
      timeline && `Timeline: ${timeline}`,
      '',
      message,
    ]
      .filter((l) => l !== false && l !== undefined && l !== 0)
      .join('\n')
    const subject = `Job ticket — ${name || 'new enquiry'}`
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Focus the first invalid field (source order), announce the summary.
      const first = ['name', 'email', 'message'].find((k) => errs[k])
      fieldRefs[first]?.current?.focus()
      return
    }
    setErrors({})
    // Honeypot: a bot that fills the hidden field is dropped silently.
    if (botField) {
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': FORM_NAME,
          'bot-field': botField,
          name,
          email,
          business,
          needs: needs.join(', '),
          timeline,
          message,
        }),
      })
      if (!res.ok) throw new Error(`submit failed: ${res.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
      requestAnimationFrame(() => errSummaryRef.current?.focus())
    }
  }

  const variants = reducedMotion
    ? { open: { opacity: 1, visibility: 'visible' }, closed: { opacity: 0, transitionEnd: { visibility: 'hidden' } } }
    : { open: { y: 0, visibility: 'visible' }, closed: { y: '-100%', transitionEnd: { visibility: 'hidden' } } }

  const errId = (f) => (errors[f] ? `${uid}-${f}-err` : undefined)

  return (
    <motion.div
      id="contact-layer"
      className="contact-layer"
      role="dialog"
      aria-modal="true"
      aria-label="Contact — start a job ticket"
      inert={!open}
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={variants}
      transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 220, damping: 28 }}
    >
      <div className="contact-layer__chrome">
        <span className="contact-layer__mark">Job Ticket</span>
        <button ref={closeRef} type="button" className="contact-layer__close" aria-label="Close contact" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="contact-layer__body">
        {status === 'success' ? (
          <section className="ticket-done" aria-live="polite">
            <p className="ticket-done__stamp">Ticket Received</p>
            <h2 ref={successRef} tabIndex={-1} className="ticket-done__title">
              Thanks, {name || 'friend'} — I&rsquo;ll reply within 1&ndash;2 business days.
            </h2>
            <p className="ticket-done__sub">
              Your ticket is in the queue. Prefer to talk sooner? Email{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
            <button type="button" className="ticket-btn" onClick={onClose}>
              Back to the work
            </button>
          </section>
        ) : (
          <>
            <header className="ticket-head">
              <h2 className="ticket-head__title">Start a job ticket</h2>
              <p className="ticket-head__sub">
                Tell me what needs doing. Prefer email?{' '}
                <a href={`mailto:${EMAIL}`} className="ticket-head__mail">{EMAIL}</a>
              </p>
            </header>

            {status === 'error' && (
              <div ref={errSummaryRef} tabIndex={-1} className="ticket-fail" role="alert">
                <p>
                  Something went wrong sending that. Nothing&rsquo;s lost — open it in your email app:
                </p>
                <a className="ticket-btn ticket-btn--mail" href={mailtoHref()}>
                  Email it instead
                </a>
                <label className="ticket-field ticket-field--copy">
                  <span className="ticket-label">Or copy your message</span>
                  <textarea className="ticket-input" readOnly rows={4} value={message} aria-label="Your message, copyable" />
                </label>
              </div>
            )}

            {/* JS submit; the static definition in index.html is what Netlify's
                build detects. hidden inputs keep name/honeypot present. */}
            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              noValidate
              className="ticket-form"
            >
              <input type="hidden" name="form-name" value={FORM_NAME} />
              <p className="ticket-hp" aria-hidden="true">
                <label>
                  Don&rsquo;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} />
                </label>
              </p>

              <div className="ticket-row">
                <label className="ticket-field" htmlFor={`${uid}-name`}>
                  <span className="ticket-label">Name <b aria-hidden="true">*</b></span>
                  <input
                    ref={nameRef}
                    id={`${uid}-name`}
                    name="name"
                    className={`ticket-input${errors.name ? ' is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errId('name')}
                    autoComplete="name"
                  />
                  {errors.name && <span id={errId('name')} className="ticket-err">{errors.name}</span>}
                </label>

                <label className="ticket-field" htmlFor={`${uid}-email`}>
                  <span className="ticket-label">Email <b aria-hidden="true">*</b></span>
                  <input
                    ref={emailRef}
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    className={`ticket-input${errors.email ? ' is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errId('email')}
                    autoComplete="email"
                  />
                  {errors.email && <span id={errId('email')} className="ticket-err">{errors.email}</span>}
                </label>
              </div>

              <label className="ticket-field" htmlFor={`${uid}-business`}>
                <span className="ticket-label">Business name <em>(optional)</em></span>
                <input
                  id={`${uid}-business`}
                  name="business"
                  className="ticket-input"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  autoComplete="organization"
                />
              </label>

              <fieldset className="ticket-field ticket-chips">
                <legend className="ticket-label">What needs doing <em>(pick any)</em></legend>
                <div className="ticket-chiprow">
                  {NEEDS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`ticket-chip${needs.includes(n) ? ' is-on' : ''}`}
                      aria-pressed={needs.includes(n)}
                      onClick={() => toggleNeed(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ticket-field ticket-chips">
                <legend className="ticket-label">Timeline <em>(optional)</em></legend>
                <div className="ticket-chiprow">
                  {TIMELINE.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`ticket-chip${timeline === t ? ' is-on' : ''}`}
                      aria-pressed={timeline === t}
                      onClick={() => setTimeline((prev) => (prev === t ? '' : t))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="ticket-field" htmlFor={`${uid}-message`}>
                <span className="ticket-label">Message <b aria-hidden="true">*</b></span>
                <textarea
                  ref={messageRef}
                  id={`${uid}-message`}
                  name="message"
                  rows={5}
                  className={`ticket-input ticket-textarea${errors.message ? ' is-invalid' : ''}`}
                  placeholder="What's going on with your business?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errId('message')}
                />
                {errors.message && <span id={errId('message')} className="ticket-err">{errors.message}</span>}
              </label>

              <button type="submit" className="ticket-btn ticket-btn--submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send ticket'}
              </button>
              <p className="ticket-fineprint">No spam, no lists — this goes straight to me.</p>
            </form>
          </>
        )}
      </div>
    </motion.div>
  )
}
