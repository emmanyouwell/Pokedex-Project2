import React, { useState, useEffect, useRef } from 'react'
import Card from './Card'
import { ArrowRight, ArrowLeft } from 'lucide-react' //delete this line
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from '../redux/actions/pokedexAction'
import InfiniteScroll from 'react-infinite-scroll-component' //delete this line
const CardListView = () => {
    const dispatch = useDispatch()
    const { pokemons, offset, count, next, loading, error } = useSelector(state => state.pokedex)
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pokemonList, setPokemonList] = useState([]);
    const loader = useRef(null);
    const fetchNextPokemon = () => {
        setTimeout(() => {
            if (page > count) {
                setHasMore(false);
                return;
            }
            console.log("page: ", page)
            setPage((prevPage) => prevPage + 10);
        }, 1000)
    }
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPokemon()
                }
            },
            { threshold: 1 }
        );

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, []);
    useEffect(() => {
        dispatch(getPokemons({ offset: page }))
    }, [page])

    useEffect(() => {
        if (pokemons && pokemons.length > 0) {
            setPokemonList((prevPokemons) => [...prevPokemons, ...pokemons])
        }
    }, [pokemons])
    useEffect(() => {
        if (pokemonList) {
            console.log("pokemonlist: ", pokemonList)
        }
        if (count) {
            console.log("count: ", count);
        }
    }, [pokemonList, count])

    return (
        <>
            <div className='flex flex-col gap-4 min-h-screen' onScroll={fetchNextPokemon}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4" >
                    {pokemonList && pokemonList.length > 0 && pokemonList.map((item, index) => (
                        <Card key={index} id={item.id} name={item.name} type={item.type} />
                        // <p key={index}>{item.id}</p>
                    ))}
                </div>
                <div className="flex justify-center items-center">
                    <div ref={loader}
                        className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
                    ></div>
                </div>

            </div>

        </>
    )
}

export default CardListView