import heroShot from '../assets/summit-home.jpg'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
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

        <div className="hero__visual" aria-hidden="true">
          <div className="hero-proof">
            <span className="hero-proof__sticker">PG&ndash;01 &middot; Website</span>
            <div className="chrome">
              <span className="chrome__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="chrome__url">summitpharmacycolorado.com</span>
            </div>
            <div className="hero-proof__shot">
              <img
                src={heroShot}
                alt="Summit Pharmacy homepage — illustrated mountain sunrise with the headline 'Pharmacy care with a breath of fresh air'"
              />
            </div>
          </div>
          <span className="hero-proof__mark">
            Proof &middot; PG Studio &middot; Denver, CO
          </span>
        </div>
      </div>
    </section>
  )
}
