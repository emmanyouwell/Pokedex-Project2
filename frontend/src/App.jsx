import React,{ useState } from "react";
import Card from "./components/Card";
import CardListView from "./components/CardListView";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">Pokedex</h1>
      <div className="flex justify-center items-center p-8">
      <CardListView/>
      </div>
      
      <ToastContainer/>
    </>
  );
}

export default App;
