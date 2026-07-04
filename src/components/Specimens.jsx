/*
 * Specimens — the canonical design-system components (buttons, cards,
 * badges, stickers, tags) in their variants, for the /styleguide/ route.
 * They consume the .btn/.card/.badge/.sticker/.tag classes from index.css,
 * so each ThemeSection renders them re-themed. Interactive states
 * (:hover/:focus/:active) are live — hover or tab to a control to see them.
 */
export default function Specimens() {
  return (
    <div className="sg-specimens">
      <div className="sg-specimen-row">
        <button className="btn btn--primary" type="button">
          Primary
        </button>
        <button className="btn btn--secondary" type="button">
          Secondary
        </button>
        <button className="btn btn--loud" type="button">
          Loud CTA
        </button>
        <button className="btn btn--ghost" type="button">
          Ghost
        </button>
        <button className="btn btn--primary btn--sm" type="button">
          Small
        </button>
        <button className="btn btn--primary" type="button" disabled>
          Disabled
        </button>
      </div>

      <div className="sg-specimen-row">
        <div className="card card--accent sg-card">
          <span className="card__accent" />
          <p className="sg-card__label">Card · default</p>
          <p className="sg-card__body">
            White surface, edge keyline, hard 4px shadow, one Lead accent bar. Hover steps the
            shadow to 6px.
          </p>
        </div>
        <div className="card card--accent card--flood sg-card">
          <span className="card__accent" />
          <p className="sg-card__label">Card · flood hover</p>
          <p className="sg-card__body">Hover floods the 8% Lead tint instead of stepping.</p>
        </div>
        <div className="card card--accent card--inverted sg-card">
          <span className="card__accent" />
          <p className="sg-card__label">Card · inverted</p>
          <p className="sg-card__body">Anchor surface, white text, one Pop accent.</p>
        </div>
      </div>

      <div className="sg-specimen-row">
        <span className="badge">Sale</span>
        <span className="badge badge--flash">New</span>
        <span className="sticker">Sticker −8°</span>
        <span className="sticker sticker--right">Sticker +8°</span>
        <span className="tag">Mono tag</span>
      </div>
    </div>
  )
}
