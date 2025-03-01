import React from 'react'
import CardListView from '../components/CardListView'
const Home = () => {
    return (
        <>
            <h1 className="text-3xl font-bold underline text-center">Pokedex</h1>
            <div className="flex justify-center items-center p-8">
                <CardListView />
            </div>

        </>
    )
}

export default Home