import { Link } from "react-router-dom";


export default function Footer() {


  return (

    <footer className="footer">


      <div className="footer-content">



        <div className="footer-brand">

          <h2>
            François Benett
          </h2>


          <p>
            Peintre contemporain
          </p>


        </div>





        <div className="footer-links">


          <Link to="/collections">
            Collections
          </Link>


          <Link to="/parcours">
            Parcours
          </Link>


          <Link to="/contact">
            Contact
          </Link>


        </div>






        <div className="footer-contact">


          <a href="mailto:benett.peintre@hotmail.fr">
            benett.peintre@hotmail.fr
          </a>


          <a href="tel:+33000000000">
            Téléphone
          </a>


          <a
            href="https://www.instagram.com/francois_benett/"
            target="_blank"
          >
            François Benett
          </a>


        </div>



      </div>





      <div className="footer-bottom">


        © {new Date().getFullYear()} François Benett


      </div>



    </footer>

  );

}