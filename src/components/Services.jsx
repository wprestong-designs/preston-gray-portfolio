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
    title: 'Menus, Flyers & Collateral',
    description:
      'The pieces your customers actually hold — menus, flyers, and service sheets designed to feel as good as what you serve or sell.',
    accent: 'orange',
  },
  {
    number: '03',
    title: 'Social Content & Campaigns',
    description:
      'On-brand posts and simple campaigns that keep your business visible — without scrambling for content every week.',
    accent: 'sky',
  },
  {
    number: '04',
    title: 'Brand Starter Kits',
    description:
      'A logo, colors, and simple brand foundations — so everything customers see looks like it belongs to the same business.',
    accent: 'green',
  },
  {
    number: '05',
    title: 'Local Visibility & Marketing Systems',
    description:
      'Google Business, reviews, local SEO, and simple marketing systems that keep you visible without daily effort.',
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
          description="No big-agency process — just practical pieces you can pick from, built well and made to work together."
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
