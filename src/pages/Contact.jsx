export default function Contact() {
  return (
    <main className="contact-page">
      <header className="contact-header">
        
        <h1>Contact</h1>

        <p className="contact-introduction">
          Pour toute demande concernant une œuvre, une exposition
          ou un projet artistique, vous pouvez me contacter directement.
        </p>
      </header>

      <section className="contact-grid">
        <div className="contact-item">
          <p className="contact-label">Téléphone</p>

          <a
            className="contact-link"
            href="tel:+33681099836"
          >
            +33 6 81 09 98 36
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-item">
          <p className="contact-label">E-mail</p>

          <a
            className="contact-link"
            href="mailto:benett.peintre@hotmail.fr"
          >
            benett.peintre@hotmail.fr
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-item">
          <p className="contact-label">Instagram</p>

          <a
            className="contact-link"
            href="https://www.instagram.com/francois_benett/"
            target="_blank"
            rel="noreferrer"
          >
            @francois_benett
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-item">
          <p className="contact-label">Singulart</p>

          <a
            className="contact-link"
            href="https://www.singulart.com/fr/artiste/fran%C3%A7ois-benett-31295?ref=ts"
            target="_blank"
            rel="noreferrer"
          >
            Contactez via Singulart
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="contact-signature">
        <p>Œuvres originales · Expositions · Projets artistiques</p>
      </section>
    </main>
  );
}