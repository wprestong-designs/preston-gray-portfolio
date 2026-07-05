/*
 * Quote (§H) — a client pull-quote in the print-shop "proof annotation"
 * treatment. Ships DORMANT: renders nothing until a proof has a `quote`
 * ({ text, name, role }) wired in projects.js. PUBLISH NONE tonight — see
 * docs/testimonial-candidates.md (no real quotes exist yet; do not fabricate).
 */
export default function Quote({ text, name, role }) {
  if (!text) return null
  return (
    <figure className="proof-quote">
      <blockquote className="proof-quote__text">{text}</blockquote>
      {(name || role) && (
        <figcaption className="proof-quote__by">
          {name}
          {name && role ? ' · ' : ''}
          {role && <span className="proof-quote__role">{role}</span>}
        </figcaption>
      )}
    </figure>
  )
}
