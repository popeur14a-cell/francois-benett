export default function Contact() {

  return (

    <main className="contact-page">


      <section className="contact-header">

        <h1>
          Contact
        </h1>

        <p>
          Pour toute demande d’information,
          d’exposition ou concernant une œuvre,
          vous pouvez contacter François Benett.
        </p>

      </section>




      <section className="contact-card">


        <div className="contact-item">

          <h2>
            Email
          </h2>

          <a 
            className="contact-link"
            href="mailto:benett.peintre@hotmail.fr"
          >
            benett.peintre@hotmail.fr
          </a>

        </div>




        <div className="contact-item">

          <h2>
            Téléphone
          </h2>

          <a 
            className="contact-link"
            href="tel:+33 06 81 09 98 36"
          >
            +33 06 81 09 98 36
          </a>

        </div>





        <div className="contact-item">

          <h2>
            Instagram
          </h2>


          <a
            className="contact-link"
            href="https://www.instagram.com/francois_benett/"
            target="_blank"
            rel="noreferrer"
          >
            François Benett
          </a>


        </div>


      </section>


    </main>

  );

}