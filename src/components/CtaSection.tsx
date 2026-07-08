import { useState, type FormEvent } from 'react'
import { CONTACT_EMAIL, copy, type Lang } from '../copy'
import { PPMark } from './icons'

/** CTA-lomake — kokoaa kentät mailto-linkiksi, lähetys tapahtuu käyttäjän sähköpostiohjelmassa. */
function CtaForm({ lang }: { lang: Lang }) {
  const c = copy[lang].cta
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    const subject = `${c.subject} — ${name}`
    const body = [
      `${c.nameLabel}: ${name}`,
      `${c.emailLabel}: ${email}`,
      '',
      message,
    ].join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="cta-card" role="status">
        <h3 className="cta-card__sent-title">{c.sentTitle}</h3>
        <p className="cta-card__sent-body">
          {c.sentBody}{' '}
          <a className="cta-card__mail" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form className="cta-card" onSubmit={onSubmit}>
      <label className="field">
        <span className="field__label">{c.nameLabel}</span>
        <input className="field__input" type="text" name="name" required />
      </label>
      <label className="field">
        <span className="field__label">{c.emailLabel}</span>
        <input className="field__input" type="email" name="email" required />
      </label>
      <label className="field">
        <span className="field__label">{c.messageLabel}</span>
        <textarea
          className="field__input field__input--area"
          name="message"
          rows={4}
          placeholder={c.messagePlaceholder}
          required
        />
      </label>
      <button className="btn btn--brass cta-card__submit" type="submit">
        {c.submit}
      </button>
      <p className="cta-card__fallback">
        {c.orWrite}{' '}
        <a className="cta-card__mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  )
}

/** Yhteysosio (kraft): otsikko + lomake + mono-dipnot + footer-lockup. */
export default function CtaSection({ lang }: { lang: Lang }) {
  const c = copy[lang].cta
  const f = copy[lang].footer

  return (
    <section id="yhteys" className="cta-section">
      <div className="cta-section__block">
        <p className="tag" data-fade="up">{c.tag}</p>
        <h2 className="cta-section__title" data-fade="up">{c.title}</h2>
        <p className="body" data-fade="up">{c.body}</p>
        <div data-fade="up">
          <CtaForm lang={lang} />
        </div>
        <p className="cta-section__note">{c.note}</p>
      </div>

      <footer className="footer">
        <div className="footer__lockup">
          <PPMark size={44} />
          <div>
            <div className="footer__name">Pohjapaja</div>
            <div className="footer__sub">{f.lockup}</div>
          </div>
        </div>
        <div className="footer__company">{f.company}</div>
      </footer>
    </section>
  )
}
