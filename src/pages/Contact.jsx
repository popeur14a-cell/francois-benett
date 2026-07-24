import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowIcon } from "../components/Icons";
import { ArtistLinkedText } from "../components/ArtistName";
import useLanguage from "../context/useLanguage";

const SITE_URL = "https://www.benett-peintre.fr";

export default function Contact() {
  const { language } = useLanguage();
  const en = language === "en";
  const [searchParams] = useSearchParams();
  const startedAt = useRef(0);
  const artwork = searchParams.get("artwork") || "";
  const dimensions = searchParams.get("dimensions") || "";
  const collection = searchParams.get("collection") || "";
  const artworkUrl = searchParams.get("url") || "";
  const groupedWorks = searchParams.get("artworks") || "";

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const initialMessage = useMemo(() => {
    if (groupedWorks) {
      return en
        ? `Hello, I would like more information about the following works: ${groupedWorks}.`
        : `Bonjour, je souhaiterais recevoir davantage d’informations concernant les œuvres suivantes : ${groupedWorks}.`;
    }
    if (!artwork) return "";
    const format = dimensions ? `, ${en ? "format" : "format"} ${dimensions}` : "";
    return en
      ? `Hello, I would like more information about the artwork “${artwork}”${format}.`
      : `Bonjour, je souhaiterais recevoir davantage d’informations concernant l’œuvre « ${artwork} »${format}.`;
  }, [artwork, dimensions, groupedWorks, en]);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: initialMessage,
    siteWeb: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nom.trim()) {
      nextErrors.nom = en ? "You have not entered your name." : "Vous n’avez pas renseigné votre nom.";
    }
    if (!form.email.trim()) {
      nextErrors.email = en ? "You have not entered your email address." : "Vous n’avez pas renseigné votre e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = en ? "Enter a valid email address." : "Indiquez une adresse e-mail valide.";
    }
    if (!form.sujet) {
      nextErrors.sujet = en ? "You have not selected a subject." : "Vous n’avez pas choisi de sujet.";
    }
    const messageWordCount = form.message.trim().split(/\s+/).filter(Boolean).length;
    if (!form.message.trim()) {
      nextErrors.message = en ? "You have not entered a message." : "Vous n’avez pas renseigné de message.";
    } else if (messageWordCount < 5) {
      nextErrors.message = en ? "Your message must contain at least 5 words." : "Votre message doit contenir au moins 5 mots.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (status === "sending" || !validate()) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          artwork,
          dimensions,
          collection,
          artworkUrl,
          groupedWorks,
          language,
          startedAt: startedAt.current,
          requestId:
            window.crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        }),
      });
      if (!response.ok) throw new Error("send-failed");

      setStatus("success");
      setForm({ nom: "", email: "", sujet: "", message: "", siteWeb: "" });
      startedAt.current = Date.now();
    } catch {
      setStatus("error");
    }
  };

  const description = en
    ? "Contact François Benett about an original artwork, an exhibition or an artistic project."
    : "Contactez François Benett pour toute demande concernant une œuvre originale, une exposition ou un projet artistique.";

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{en ? "Contact François Benett — Contemporary painter" : "Contacter François Benett — Artiste peintre"}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content={en ? "Contact François Benett" : "Contacter François Benett"} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE_URL}/images/portrait-2.jpg`} />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="contact-page">
        <header className="contact-header">
          <h1><ArtistLinkedText>{en ? "Contact François Benett" : "Contacter François Benett"}</ArtistLinkedText></h1>
          <p className="contact-introduction">
            <ArtistLinkedText>{en
              ? "For enquiries about an original work, an exhibition or an artistic project, write directly to François Benett."
              : "Pour toute demande concernant une œuvre originale, une exposition ou un projet artistique, écrivez directement à François Benett."}</ArtistLinkedText>
          </p>
        </header>

        <section className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="contact-form-heading">
            <span>{en ? "Your enquiry" : "Votre demande"}</span>
            <h2 id="contact-form-title">{en ? "Send a message" : "Envoyer un message"}</h2>
            {artwork && (
              <p className="contact-artwork-context">
                {en ? "Artwork concerned:" : "Œuvre concernée :"} <strong>{artwork}</strong>
                {dimensions && ` — ${dimensions}`}
              </p>
            )}
          </div>

          <form className="contact-form" onSubmit={sendMessage} noValidate>
            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor="contact-site-web">Site web</label>
              <input id="contact-site-web" name="siteWeb" type="text" tabIndex="-1" autoComplete="off" value={form.siteWeb} onChange={updateField} />
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-nom">{en ? "Name" : "Nom"}</label>
                <input id="contact-nom" name="nom" type="text" autoComplete="name" maxLength="100" value={form.nom} onChange={updateField} aria-invalid={Boolean(errors.nom)} aria-describedby={errors.nom ? "contact-nom-error" : undefined} />
                {errors.nom && <span className="contact-field-error" id="contact-nom-error">{errors.nom}</span>}
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">E-mail</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" maxLength="200" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
                {errors.email && <span className="contact-field-error" id="contact-email-error">{errors.email}</span>}
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-sujet">{en ? "Subject" : "Sujet"}</label>
              <select id="contact-sujet" name="sujet" value={form.sujet} onChange={updateField} aria-invalid={Boolean(errors.sujet)} aria-describedby={errors.sujet ? "contact-sujet-error" : undefined}>
                <option value="" disabled>{en ? "Choose a subject" : "Choisissez un sujet"}</option>
                <option value="artwork">{en ? "Enquiry about an artwork" : "Demande concernant une œuvre"}</option>
                <option value="exhibition">{en ? "Exhibition proposal" : "Proposition d’exposition"}</option>
                <option value="project">{en ? "Artistic project" : "Projet artistique"}</option>
                <option value="other">{en ? "Other enquiry" : "Autre demande"}</option>
              </select>
              {errors.sujet && <span className="contact-field-error" id="contact-sujet-error">{errors.sujet}</span>}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="6" maxLength="5000" value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} />
              {errors.message && <span className="contact-field-error" id="contact-message-error">{errors.message}</span>}
            </div>

            <p className="contact-privacy-note">
              {en
                ? "The information entered is used only to reply to your request and is retained for no longer than 12 months. "
                : "Les informations saisies servent uniquement à répondre à votre demande et sont conservées au maximum 12 mois. "}
              <Link to="/confidentialite">{en ? "Learn more about your rights." : "En savoir plus sur vos droits."}</Link>
            </p>

            <button className="contact-submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? (en ? "Sending…" : "Envoi…") : (en ? "Send message" : "Envoyer le message")}
              <ArrowIcon direction="upRight" />
            </button>

            <div className="contact-form-status" aria-live="polite">
              {status === "success" && (
                <p className="contact-success">
                  <ArtistLinkedText>{artwork
                    ? en
                      ? `Your enquiry about “${artwork}” has been sent. François Benett will reply as soon as possible.`
                      : `Votre demande concernant « ${artwork} » a bien été envoyée. François Benett vous répondra dès que possible.`
                    : en
                      ? "Your enquiry has been sent. François Benett will reply as soon as possible."
                      : "Votre demande a bien été envoyée. François Benett vous répondra dès que possible."}</ArtistLinkedText>
                </p>
              )}
              {status === "error" && (
                <p className="contact-error">
                  {en
                    ? "The message could not be sent. Your information has been kept; please try again."
                    : "Le message n’a pas pu être envoyé. Vos informations sont conservées ; réessayez."}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="contact-grid" aria-label={en ? "François Benett contact details" : "Coordonnées de François Benett"}>
          {[
            { label: en ? "Phone" : "Téléphone", href: "tel:+33681099836", text: "+33 6 81 09 98 36" },
            { label: "E-mail", href: "mailto:benett.peintre@hotmail.fr", text: "benett.peintre@hotmail.fr" },
            { label: "Instagram", href: "https://www.instagram.com/benett_gallery/", text: "@benett_gallery", external: true },
            { label: "Singulart", href: "https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts", text: en ? "View on Singulart" : "Voir sur Singulart", external: true },
          ].map((item) => (
            <div className="contact-item" key={item.label}>
              <h2 className="contact-label">{item.label}</h2>
              <a className="contact-link" href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                {item.text}<ArrowIcon direction="upRight" />
              </a>
            </div>
          ))}
        </section>

        <section className="contact-signature" aria-label={en ? "Accepted enquiries" : "Types de demandes acceptées"}>
          <p>{en ? "Original works · Exhibitions · Artistic projects" : "Œuvres originales · Expositions · Projets artistiques"}</p>
        </section>
      </main>
    </>
  );
}
