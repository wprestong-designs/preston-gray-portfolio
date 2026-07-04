import { useEffect, useRef, useState } from 'react'
import SectionHeader from './SectionHeader.jsx'
import SpecPanel from './SpecPanel.jsx'
import { useFloodColor } from '../context/flood-context.js'
import { getProofBySlug } from '../data/projects.js'
import { ProofLift, StampWobble } from './ProofLift.jsx'
import summitHome from '../assets/summit-home.jpg'
import summitRefill from '../assets/summit-refill.png'
import summitDermatology from '../assets/summit-dermatology.jpg'
import summitOphthalmology from '../assets/summit-ophthalmology.jpg'
import summitWomensHealth from '../assets/summit-womens-health.jpg'
import summitGeneralRx from '../assets/summit-general-rx.jpg'
import summitReviews from '../assets/summit-reviews.png'
import summitEthics from '../assets/summit-ethics-graphic.png'
import summitServiceCare from '../assets/summit-service-care-graphic.png'
import summitLogoVertical from '../assets/summit-logo-vertical.png'
import summitLogoHorizontal from '../assets/summit-logo-horizontal.png'
import ourcoHome from '../assets/ourco-home.jpg'
import ourcoAbout from '../assets/ourco-about.jpg'
import bristolHome from '../assets/bristol-home.jpg'
import pinnacleHome from '../assets/pinnacle-home.jpg'
import prosourceHome from '../assets/prosource-home.jpg'
import crmAnalyticsDesktop from '../assets/crm-analytics-desktop.jpg'
import crmAccountsDesktop from '../assets/crm-accounts-desktop.jpg'
import crmTodayDesktop from '../assets/crm-today-desktop.jpg'
import crmFieldDesktop from '../assets/crm-field-desktop.jpg'
import crmMoreDesktop from '../assets/crm-more-desktop.jpg'
import crmTodayMobile from '../assets/crm-today-mobile.png'
import crmAccountsMobile from '../assets/crm-accounts-mobile.png'
import crmAccountProfileMobile from '../assets/crm-account-profile-mobile.png'

/*
 * All frames crop consistently: object-fit cover anchored to the top, so
 * nav/logo/headline areas stay visible at any aspect ratio. Brand graphics
 * that shouldn't be cropped use fit: 'contain'.
 *
 * Every CRM screen here is the demo build with synthetic sample data —
 * never place real provider/patient/Rx/revenue data in this file.
 */
const features = [
  {
    id: 'pg-01',
    index: 'PG–01',
    category: 'Pharmacy Website · Brand & Follow-Up System',
    accent: 'green',
    title: 'Summit Pharmacy — Website & Marketing System',
    description:
      'A ground-up redesign of summitpharmacycolorado.com. I created the logo, colors, type, and visual style, then carried it through service pages, copy written side-by-side with the pharmacists, and the print pieces and provider handouts around the site.',
    built: [
      'Logo, color system & type',
      'Full site redesign with specialty pages: dermatology, ophthalmology, women’s health, general Rx',
      'Rx refill request form with secure, HIPAA-aware submission',
      'Compound Rx brochure used across 15+ pharmacies',
      'Price sheets, delivery map & provider handouts',
    ],
    media: 'dual',
    urlA: 'summitpharmacycolorado.com',
    urlB: 'rx refill request form',
    imageA: summitHome,
    imageB: summitRefill,
    altA: "Summit Pharmacy homepage — illustrated mountain sunrise with the headline 'Pharmacy care with a breath of fresh air'",
    altB: 'Summit Pharmacy Rx refill request page with patient form and HIPAA notice',
    links: [
      { label: 'Visit Summit Pharmacy', href: 'https://summitpharmacycolorado.com/' },
    ],
    spec: {
      intro:
        'The full package, front to back: I created Summit’s logo, colors, type, and illustration direction, then carried it through every page, form, and printed piece.',
      brand: {
        logos: [
          {
            image: summitLogoVertical,
            alt: 'Summit Pharmacy round badge logo — mountain sunrise mark',
            caption: 'Badge Lockup',
          },
          {
            image: summitLogoHorizontal,
            alt: 'Summit Pharmacy horizontal logo lockup',
            caption: 'Horizontal Lockup',
          },
        ],
        swatches: [
          { hex: '#2D4F50', name: 'Deep Spruce' },
          { hex: '#FC7C39', name: 'Sunrise Orange' },
          { hex: '#FCBD59', name: 'Muted Yellow' },
          { hex: '#F6ECC9', name: 'Warm Cream' },
        ],
        type: {
          label: 'Display Type · Rounded Sans',
          sample: 'Pharmacy care with a breath of fresh air',
        },
      },
      galleries: [
        {
          layout: 'grid',
          items: [
            {
              image: summitDermatology,
              alt: 'Summit Pharmacy dermatology specialty page',
              caption: 'Specialty Page · Dermatology',
              frame: 'browser',
            },
            {
              image: summitOphthalmology,
              alt: 'Summit Pharmacy ophthalmology specialty page',
              caption: 'Specialty Page · Ophthalmology',
              frame: 'browser',
            },
            {
              image: summitWomensHealth,
              alt: 'Summit Pharmacy women’s health specialty page',
              caption: 'Specialty Page · Women’s Health',
              frame: 'browser',
            },
            {
              image: summitGeneralRx,
              alt: 'Summit Pharmacy general prescriptions page',
              caption: 'Specialty Page · General Rx',
              frame: 'browser',
            },
            {
              image: summitReviews,
              alt: 'Summit Pharmacy reviews section showing its Google rating',
              caption: 'Trust Section · 4.9 on Google',
              frame: 'browser',
            },
            {
              image: summitEthics,
              alt: 'Summit Pharmacy brand ethics graphic',
              caption: 'Brand Graphic · Our Ethics',
              fit: 'contain',
            },
            {
              image: summitServiceCare,
              alt: 'Summit Pharmacy brand graphic — service plus care equals a breath of fresh air',
              caption: 'Brand Graphic · Care + Service',
              fit: 'contain',
            },
          ],
        },
      ],
      footnote:
        'Ongoing: seasonal print pieces, price sheets, and provider handouts carry the same look and voice.',
    },
  },
  {
    id: 'pg-02',
    index: 'PG–02',
    category: 'Industrial Website · Art Direction · Local Presence',
    accent: 'orange',
    title: 'Ourco — Houston Welding & Industrial',
    description:
      'A welding, gas, and industrial supply company with a strong personality — so the site got one too. A deliberately bold, high-impact visual direction built around the owner’s vision, structured for services, brands, company story, and quote requests.',
    built: [
      'Full site design & build',
      'Bold visual direction shaped around the owner’s vision',
      'Service, brand directory & quote pages',
      'Google Business & local search setup',
      'Launch plan & social post planning',
    ],
    media: 'single',
    url: 'ourco · live site',
    image: ourcoHome,
    alt: 'Ourco Welding & Industrial Supplies homepage — bold metal-frame hero with Houston skyline',
    spec: {
      intro:
        'Bold on purpose — the brand direction, page structure, and local presence were built around how this company actually wins work: relationships and reputation.',
      galleries: [
        {
          layout: 'grid',
          items: [
            {
              image: ourcoAbout,
              alt: 'Ourco about page telling the company story',
              caption: 'About Page · Built in Houston',
              frame: 'browser',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'pg-03',
    index: 'PG–03',
    category: 'Pharmacy Websites · Localized per Market',
    accent: 'sky',
    title: 'Bristol, Pinnacle & Prosource',
    description:
      'Three pharmacy websites built on the framework proven at Summit, then localized for Oklahoma City, Little Rock, and Las Vegas — each with its own brand, local visuals, and homepage personality.',
    built: [
      'Bristol Pharmacy — localized adaptation for the OKC market',
      'Pinnacle Rx — its own UI direction and branded homepage',
      'Prosource Pharmacy — in progress (Coming Soon)',
      'Shared patient & provider pages, tailored to each location',
    ],
    media: 'dual',
    urlA: 'rxbristolokc.com',
    urlB: 'pinnacle-rx.com',
    imageA: bristolHome,
    imageB: pinnacleHome,
    altA: "Bristol Pharmacy homepage — warm prairie landscape illustration with the headline 'Your Prescription, Delivered with Care', Oklahoma City",
    altB: 'Pinnacle Pharmacy homepage — red mountain landscape illustration, Little Rock, Arkansas',
    mediaCaption: 'One framework — three brands, three markets.',
    links: [
      { label: 'Bristol Pharmacy', href: 'https://rxbristolokc.com/' },
      { label: 'Pinnacle Rx', href: 'https://pinnacle-rx.com/' },
      { label: 'Prosource Pharmacy · Coming Soon' },
    ],
    spec: {
      intro:
        'Same proven bones, three different personalities — each market got its own brand color, landscape illustration, and voice.',
      galleries: [
        {
          layout: 'grid',
          items: [
            {
              image: prosourceHome,
              alt: 'Prosource Pharmacy homepage in progress — Las Vegas market, not yet live',
              caption: 'Prosource · Las Vegas · In Progress',
              frame: 'browser',
              badge: 'Coming Soon',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'pg-04',
    index: 'PG–04',
    category: 'Internal Systems · CRM · Reporting',
    accent: 'purple',
    title: 'Summit Field Intel — CRM & Provider Tools',
    description:
      'A custom CRM and field-planning tool I built for my own pharmacy sales work — visit planning, office profiles, follow-up tracking, and clean provider-facing reports. I use it every day, so every feature earned its place.',
    built: [
      'Territory mapping & weekly route planning',
      'Office & provider profiles with visit notes',
      'Branded access reports designed for outreach',
      'Follow-up tracking, analytics & reporting',
      'Mobile field workflow (iOS version in design)',
    ],
    kicker:
      'If part of your business runs on spreadsheets and memory, I can probably build you something better.',
    media: 'dual',
    urlA: 'field intel · analytics (demo)',
    urlB: 'accounts (demo)',
    imageA: crmAnalyticsDesktop,
    imageB: crmAccountsDesktop,
    altA: 'Summit Field Intel analytics dashboard — demo build with sample data',
    altB: 'Summit Field Intel accounts list — demo build with sample data',
    spec: {
      intro:
        'Built for a day in the field — desktop for planning, phone for the parking lot. Everything below is the demo build with synthetic sample data.',
      galleries: [
        {
          layout: 'grid',
          items: [
            {
              image: crmTodayDesktop,
              alt: 'Field Intel Today screen with daily priorities — demo build with sample data',
              caption: 'Today · Daily Priorities',
              frame: 'browser',
            },
            {
              image: crmFieldDesktop,
              alt: 'Field Intel field view with routes and follow-ups — demo build with sample data',
              caption: 'Field · Routes & Follow-Ups',
              frame: 'browser',
            },
            {
              image: crmMoreDesktop,
              alt: 'Field Intel sync and report center — demo build with sample data',
              caption: 'Sync & Report Center',
              frame: 'browser',
            },
          ],
        },
        {
          layout: 'phones',
          items: [
            {
              image: crmTodayMobile,
              alt: 'Field Intel mobile Today screen — demo build with sample data',
              caption: 'Mobile · Today',
              frame: 'phone',
            },
            {
              image: crmAccountsMobile,
              alt: 'Field Intel mobile accounts list — demo build with sample data',
              caption: 'Mobile · Accounts',
              frame: 'phone',
            },
            {
              image: crmAccountProfileMobile,
              alt: 'Field Intel mobile office Rx detail view — demo build with sample data',
              caption: 'Mobile · Office Rx Detail',
              frame: 'phone',
            },
          ],
        },
      ],
      footnote:
        'All screens show the demo build — synthetic providers, offices, and figures. No real business or patient data appears anywhere in this portfolio.',
    },
  },
]

const shopRows = [
  {
    index: 'A1',
    title: 'Access Reports & Provider Tools',
    description:
      'Designed reports and one-pagers that turn field data into something you can hand across a front desk.',
  },
  {
    index: 'A2',
    title: 'Google Business, Reviews & Local Search',
    description:
      'Profiles, listings, review responses, and the local visibility details most owners never have time for.',
  },
  {
    index: 'A3',
    title: 'Flyers, Handouts & Customer Materials',
    description:
      'Printed pieces that explain what you do clearly and feel as good as what you serve or sell.',
  },
  {
    index: 'A4',
    title: 'Social Posts & Promotion Support',
    description:
      'Posts, announcements, and simple promotions that keep your business visible.',
  },
  {
    index: 'A5',
    title: 'Earlier Creative Work',
    description:
      'Design and marketing for a local real estate brand — where I learned to design for real audiences.',
  },
]

function Frame({ url, image, alt, note, className = '' }) {
  return (
    <div className={`spread__frame ${className}`.trim()}>
      <div className="chrome">
        <span className="chrome__dots">
          <i />
          <i />
          <i />
        </span>
        {url && <span className="chrome__url">{url}</span>}
      </div>
      <div className="spread__shot">
        {image ? (
          <img src={image} alt={alt} loading="lazy" />
        ) : (
          <span className="shot-placeholder">{note || 'Screenshot coming soon'}</span>
        )}
      </div>
    </div>
  )
}

export default function FeaturedWork() {
  const [openSpecs, setOpenSpecs] = useState({})
  const { activeId, flood, clearFlood } = useFloodColor()
  const spreadRefs = useRef({})

  const toggleSpec = (id) =>
    setOpenSpecs((prev) => ({ ...prev, [id]: !prev[id] }))

  /*
   * Touch devices have no hover, so the flood follows scroll: a spread
   * floods while it crosses the middle band of the viewport. Spreads
   * initialize white — the observer only fires after mount. On pointer
   * devices the mouse/focus handlers below drive the same shared context.
   */
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const proofId = entry.target.dataset.proof
          if (entry.isIntersecting) {
            flood(proofId)
          } else {
            clearFlood(proofId)
          }
        })
      },
      { rootMargin: '-30% 0px -30% 0px' },
    )
    Object.values(spreadRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [flood, clearFlood])

  return (
    <section className="work section" id="work">
      <div className="container">
        <SectionHeader
          eyebrow="Featured Work"
          title="A few things I’ve helped build"
          description={'Websites, tools, and customer-facing pieces — created for pharmacies, local businesses, and growing teams.'}
        />
      </div>

      <ul className="spreads">
        {features.map((f) => {
          const specId = `spec-${f.id}`
          const isOpen = !!openSpecs[f.id]
          const proof = getProofBySlug(f.id)
          const proofId = proof?.id
          return (
            <li
              key={f.index}
              id={f.id}
              ref={(el) => {
                spreadRefs.current[f.id] = el
              }}
              data-spread={f.id}
              data-proof={proofId}
              className={`spread spread--${f.accent}${activeId === proofId ? ' is-flooded' : ''}`}
              onMouseEnter={() => flood(proofId)}
              onMouseLeave={() => clearFlood(proofId)}
              onFocus={() => flood(proofId)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) clearFlood(proofId)
              }}
            >
              <div className="spread__inner">
                <div className="spread__media">
                  <StampWobble className="spread__sticker" aria-hidden="true">
                    {f.index}
                  </StampWobble>
                  <div className={`spread__frames${f.media === 'dual' ? ' spread__frames--dual' : ''}`}>
                    {f.media === 'dual' ? (
                      <>
                        <ProofLift className="spread__frame--a" color={proof?.color}>
                          <Frame url={f.urlA} image={f.imageA} alt={f.altA} />
                        </ProofLift>
                        <ProofLift className="spread__frame--b" color={proof?.color}>
                          <Frame url={f.urlB} image={f.imageB} alt={f.altB} />
                        </ProofLift>
                      </>
                    ) : (
                      <ProofLift color={proof?.color}>
                        <Frame url={f.url} image={f.image} alt={f.alt} note={f.placeholderNote} />
                      </ProofLift>
                    )}
                  </div>
                  {f.mediaCaption && (
                    <p className="spread__media-caption">{f.mediaCaption}</p>
                  )}
                </div>

                <div className="spread__text">
                  <p className="spread__meta">
                    <span className="spread__meta-index">{f.index}</span>
                    {f.category}
                  </p>
                  <h3 className="spread__title">{f.title}</h3>
                  <p className="spread__description">{f.description}</p>
                  <div className="spread__built">
                    <span className="spread__built-label">What I built</span>
                    <ul>
                      {f.built.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {f.kicker && <p className="spread__kicker">{f.kicker}</p>}
                  {f.links && (
                    <ul className="spread__links">
                      {f.links.map((link) =>
                        link.href ? (
                          <li key={link.label}>
                            <a
                              className="link-pill"
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.label}
                              <span aria-hidden="true">&nbsp;&#8599;</span>
                            </a>
                          </li>
                        ) : (
                          <li key={link.label}>
                            <span className="link-pill link-pill--muted">{link.label}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                  {f.spec && (
                    <button
                      type="button"
                      className="spec-toggle"
                      aria-expanded={isOpen}
                      aria-controls={specId}
                      onClick={() => toggleSpec(f.id)}
                    >
                      {isOpen ? `Close Spec · ${f.index}` : `View Full Spec · ${f.index}`}
                    </button>
                  )}
                </div>
              </div>

              {f.spec && <SpecPanel id={specId} open={isOpen} spec={f.spec} />}
            </li>
          )
        })}
      </ul>

      <div className="container">
        <div className="shop">
          <p className="shop__label">Also in the shop</p>
          <ul className="shop__list">
            {shopRows.map((row) => (
              <li key={row.title} className="shop-row">
                <span className="shop-row__index">{row.index}</span>
                <h3 className="shop-row__title">{row.title}</h3>
                <p className="shop-row__description">{row.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
