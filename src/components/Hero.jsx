import CompositionHero from './CompositionHero.jsx'

/*
 * Editorial masthead over the full-width composition canvas (spec §1,
 * decision D). The old oversized Summit proof lives on as Summit's cursor
 * card preview and its Phase 5 morph target.
 */
export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero__masthead">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Denver, Colorado
          </p>
          <h1 className="hero__headline">
            I help small businesses look as good as{' '}
            <span className="hero__headline-accent">the work they do.</span>
          </h1>
          <p className="hero__subhead">
            Websites, customer handouts, social posts, brand basics, and
            simple follow-up systems &mdash; practical pieces, built well,
            that make your business easier to find, easier to trust, and
            easier to choose.
          </p>
          <div className="hero__actions">
            <a href="#work" className="btn btn--primary">
              View Work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Contact Me
            </a>
          </div>
        </div>
      </div>

      <CompositionHero />
    </section>
  )
}
