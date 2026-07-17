import { useState } from "react";
import { Link } from "react-router-dom";


export default function Home() {


  const éléments = [

    "/images/accueil/oeuvre1.jpg",
    "/images/accueil/oeuvre2.jpg",
    "/images/accueil/oeuvre3.jpg",
    "/images/accueil/oeuvre4.jpg",
    "/images/accueil/oeuvre5.jpg",
    "collection"

  ];



  const [index, setIndex] = useState(2);

  const [animation, setAnimation] = useState(false);



  function changerSlide(nouvelIndex) {


    setAnimation(false);


    setTimeout(()=>{

      setIndex(nouvelIndex);

      setAnimation(true);

    },100);


  }



  function suivant(){

    changerSlide(
      (index + 1) % éléments.length
    );

  }



  function precedent(){

    changerSlide(
      (index - 1 + éléments.length) % éléments.length
    );

  }



  const afficher = [

    éléments[(index - 1 + éléments.length) % éléments.length],

    éléments[index],

    éléments[(index + 1) % éléments.length]

  ];




  return (

    <main>


      <section className="hero">

        <img

          src="/images/benett-cover.jpg"

          alt="François Benett"

        />

      </section>





      <section className="decouvrir">


        <h1>
          DÉCOUVRIR
        </h1>


        <p>
          Entrez dans l’univers de François Benett,
          un peintre contemporain où la lumière,
          la poésie et l’émotion se rencontrent.
        </p>


        <p>
          Ses œuvres invitent le regard à voyager
          entre paysages, personnages et imaginaires.
        </p>


      </section>






      <section className="oeuvres-section">


        <h2>
          Œuvres à découvrir
        </h2>



        <div className="slider-container">


          <button
            className="slider-arrow"
            onClick={precedent}
          >
            ←
          </button>




          <div

            className={
              animation
              ? "oeuvres-slider slide-animation"
              : "oeuvres-slider"
            }

          >


            {afficher.map((élément,i)=>


              élément === "collection" ?


              <Link

                key={i}

                to="/collections"

                className="collection-card"

              >

                <div className="plus-circle">

                  +

                </div>


                <span>

                  Voir la collection

                </span>


              </Link>



              :


              <img

                key={i}

                src={élément}

                className={i===1 ? "active":""}

                alt="Œuvre François Benett"

              />


            )}


          </div>





          <button

            className="slider-arrow"

            onClick={suivant}

          >

            →

          </button>



        </div>


      </section>



    </main>

  );

}