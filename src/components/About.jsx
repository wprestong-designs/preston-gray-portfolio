import SectionHeader from './SectionHeader.jsx'
import portrait from '../assets/preston-portrait.jpg'

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container about__inner">
        <div className="about__copy">
          <SectionHeader
            eyebrow="About"
            title="Hi, I&rsquo;m Preston"
          />
          <p className="about__paragraph">
            I&rsquo;m Preston &mdash; a designer and marketer in Denver. I
            don&rsquo;t just build for small businesses; I work inside one. My
            day job is field sales and marketing for a local pharmacy, which
            means I know what it&rsquo;s like to hand a brochure across a
            front desk, answer the phone, and need the website to actually
            bring in business.
          </p>
          <p className="about__paragraph">
            Most small businesses don&rsquo;t need an agency. They need
            someone who can design the site, write the words, make the print
            pieces, sort out Google, and build the practical systems behind it
            all &mdash; and who picks up when they call. That&rsquo;s the job
            I&rsquo;ve built for myself, and it&rsquo;s the work I like best.
          </p>
          <p className="about__signature" aria-hidden="true">
            &mdash; Preston
          </p>
          <ul className="about__facts">
            <li className="about__fact">
              <span className="about__fact-dot about__fact-dot--green" />
              Marketing strategy &amp; growth
            </li>
            <li className="about__fact">
              <span className="about__fact-dot about__fact-dot--orange" />
              Web design &amp; content creation
            </li>
            <li className="about__fact">
              <span className="about__fact-dot about__fact-dot--sage" />
              Practical systems &amp; internal tools
            </li>
            <li className="about__fact">
              <span className="about__fact-dot about__fact-dot--sky" />
              Business development
            </li>
          </ul>
        </div>

        <div className="about__visual">
          <div className="about-portrait">
            <div className="about-portrait__frame">
              <span className="about-portrait__tape about-portrait__tape--left" aria-hidden="true" />
              <span className="about-portrait__tape about-portrait__tape--right" aria-hidden="true" />
              <img className="about-portrait__photo" src={portrait} alt="Preston Gray" loading="lazy" />
            </div>
            <ul className="about-portrait__labels">
              <li>Denver, Colorado</li>
              <li>Small Business Creative</li>
              <li>Web + Brand + Marketing Systems</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
