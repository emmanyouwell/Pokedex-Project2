import React,{ useState } from "react";
import Card from "./components/Card";
import CardListView from "./components/CardListView";


function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">Pokedex</h1>
      <div className="flex justify-center items-center p-8">
      <CardListView/>
      </div>
      
    </>
  );
}

export default App;
