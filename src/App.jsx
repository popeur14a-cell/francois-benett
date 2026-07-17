import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Parcours from "./pages/Parcours";


export default function App() {

  return (

    <>

      <Navbar />


      <Routes>


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/collections"
          element={<Collections />}
        />


        <Route
          path="/parcours"
          element={<Parcours />}
        />


      </Routes>



      <Footer />


    </>

  );

}