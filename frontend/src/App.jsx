import React from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'aos/dist/aos.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./Pages/Home";
import SinglePokemon from "./Pages/SinglePokemon";
function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<SinglePokemon />} />
     </Routes>
     
     </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
