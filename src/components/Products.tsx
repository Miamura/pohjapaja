import { CategoryIcon, Corners } from './icons'
import type { Lang } from '../copy'
import { copy } from '../copy'

interface ProductsProps {
  lang: Lang
  onCta: () => void
}

/** "Mitä koneistamme" — brändikirjan 6 kategoriakorttia (Web & Social 02). */
export default function Products({ lang, onCta }: ProductsProps) {
  const c = copy[lang].products

  return (
    <section id="tuotteet" className="section-light products">
      <div className="divider" data-fade="up">
        <h2 className="divider__title">{c.heading}</h2>
        <span className="divider__rule" aria-hidden="true" />
        <span className="divider__count">{c.count}</span>
      </div>

      <div className="products__grid">
        {c.items.map((item) => (
          <article
            key={item.icon}
            className={`card${item.dark ? ' card--dark' : ''}`}
            data-fade="up"
          >
            <Corners />
            <div className="card__top">
              <span className="card__icon">
                <CategoryIcon name={item.icon} />
              </span>
              <span className="card__num">{item.num}</span>
            </div>
            <div>
              <h3 className="card__title">{item.title}</h3>
              <p className="card__desc">{item.desc}</p>
            </div>
            <div className="card__footer">
              <span className="card__price">{item.price}</span>
              <button className="card__cta" type="button" onClick={onCta}>
                {c.cardCta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
