/*
 * Full Spec expansion panel — one reusable component, data-driven.
 * Expands in-flow below its spread. Height animates via the grid-rows
 * trick; the global prefers-reduced-motion rule makes it instant.
 * When closed, the inner content is visibility:hidden, so it leaves the
 * tab order and accessibility tree.
 */
import { StampWobble } from './ProofLift.jsx'

export default function SpecPanel({ id, open, spec }) {
  return (
    <div id={id} className={`spec${open ? ' is-open' : ''}`}>
      <div className="spec__clip">
        <div className="spec__body">
          {spec.intro && <p className="spec__intro">{spec.intro}</p>}

          {spec.brand && (
            <div className="brand-strip">
              {spec.brand.logos.map((logo) => (
                <div key={logo.caption} className="brand-tile brand-tile--logo">
                  <img src={logo.image} alt={logo.alt} loading="lazy" />
                  <span className="brand-tile__label">{logo.caption}</span>
                </div>
              ))}
              <div className="brand-tile brand-tile--swatches">
                <div className="brand-swatches">
                  {spec.brand.swatches.map((swatch) => (
                    <div key={swatch.hex} className="brand-swatch">
                      <i style={{ background: swatch.hex }} />
                      <span className="brand-swatch__name">{swatch.name}</span>
                      <span className="brand-swatch__hex">{swatch.hex}</span>
                    </div>
                  ))}
                </div>
                <span className="brand-tile__label">Color System</span>
              </div>
              {spec.brand.type && (
                <div className="brand-tile brand-tile--type">
                  <span className="brand-type-sample">{spec.brand.type.sample}</span>
                  <span className="brand-tile__label">{spec.brand.type.label}</span>
                </div>
              )}
            </div>
          )}

          {spec.galleries?.map((gallery, i) => (
            <ul key={i} className={`spec-gallery spec-gallery--${gallery.layout}`}>
              {gallery.items.map((item) => (
                <li key={item.caption} className="spec-item">
                  <div
                    className={[
                      'spec-frame',
                      item.frame === 'phone' ? 'spec-frame--phone' : '',
                      item.fit === 'contain' ? 'spec-frame--contain' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {item.frame === 'browser' && (
                      <div className="chrome">
                        <span className="chrome__dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    )}
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    {item.badge && (
                      <StampWobble className="spec-badge">{item.badge}</StampWobble>
                    )}
                  </div>
                  <p className="spec-item__caption">{item.caption}</p>
                </li>
              ))}
            </ul>
          ))}

          {spec.footnote && <p className="spec__footnote">{spec.footnote}</p>}
        </div>
      </div>
    </div>
  )
}
