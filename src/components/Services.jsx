import SectionHeader from './SectionHeader.jsx'

const services = [
  {
    number: '01',
    title: 'Websites & Landing Pages',
    description:
      'A clean, fast website that makes your business look established — and makes it easy for customers to call, order, or request a quote.',
    accent: 'green',
  },
  {
    number: '02',
    title: 'Flyers, Handouts & Customer Materials',
    description:
      'The pieces your customers actually hold — flyers, service sheets, leave-behinds, and other materials that explain what you do clearly.',
    accent: 'orange',
  },
  {
    number: '03',
    title: 'Social Posts & Promotions',
    description:
      'Posts, announcements, and simple promotions that keep your business visible — without scrambling for content every week.',
    accent: 'sky',
  },
  {
    number: '04',
    title: 'Brand Starter Kits',
    description:
      'A logo, colors, and simple brand basics — so everything customers see looks like it belongs to the same business.',
    accent: 'green',
  },
  {
    number: '05',
    title: 'Getting Found Locally',
    description:
      'Google Business, reviews, local search basics, and simple routines that help nearby customers find and trust you.',
    accent: 'green',
  },
  {
    number: '06',
    title: 'Practical Systems & Internal Tools',
    description:
      'Forms, delivery maps, reports, and simple internal tools — the unglamorous pieces that make a business run smoother.',
    accent: 'sage',
  },
]

export default function Services() {
  return (
    <section className="services section" id="services">
      <div className="container">
        <SectionHeader
          eyebrow="Services"
          title="What I can build for your business"
          description="No big-agency process — just useful pieces you can pick from, built well and made to work together."
        />
        <ol className="service-index">
          {services.map((service) => (
            <li key={service.number} className={`service-row service-row--${service.accent}`}>
              <span className="service-row__number">{service.number}</span>
              <div className="service-row__text">
                <h3 className="service-row__title">{service.title}</h3>
                <p className="service-row__description">{service.description}</p>
              </div>
              <span className="service-row__chip" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
