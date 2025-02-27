import React, { useState, useEffect, useRef } from 'react'
import Card from './Card'
import { Search, ArrowDown10, ArrowUp01, ArrowDownZA, ArrowUpAZ } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from '../redux/actions/pokedexAction'
import { clearError } from '../redux/slices/pokedexSlice'

const CardListView = () => {
    const dispatch = useDispatch()
    const { pokemons, offset, count, next, loading, error } = useSelector(state => state.pokedex)
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pokemonList, setPokemonList] = useState([]);
    const loader = useRef(null);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const handleSubmit = () => {
        
        setIsSearching(search.length > 0);
        setPokemonList([]);
        if (search.length === 0) {
            setPage(0);
            return;
        }
     
        dispatch(getPokemons({ search: search }))
    }
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
                if (entries[0].isIntersecting && !isSearching) {
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
    }, [isSearching]);
    useEffect(() => {
        dispatch(getPokemons({ offset: page }))
    }, [page])
    useEffect(() => {
        if (error) {
            dispatch(clearError())
        }
    }, [error])
    useEffect(() => {
        if (pokemons && pokemons.length > 0) {
            setPokemonList((prevPokemons) => [...prevPokemons, ...pokemons])
        }
        else if (search) {
            setPokemonList([pokemons])
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
                <div className="sticky top-0 z-10 w-full bg-gray-400 flex justify-between items-center p-4">
                    <div className="relative flex w-full gap-2 md:w-max">
                        <input type="text" name="search" placeholder="Search name or ID (e.g. Bulbasaur or 1) " id="search" className="min-w-[358px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => setSearch(e.target.value)} />
                        <Search className="h-6 w-6 !absolute right-1 top-1 rounded text-gray-700/50 hover:text-gray-700 transition-all hover:cursor-pointer" onClick={handleSubmit} />
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold">Sort: </span>
                        <ArrowDown10 className="hover:bg-gray-600 hover:text-white rounded-md w-6 h-6"/>
                        <ArrowUp01 className="hover:bg-gray-600 hover:text-white rounded-md w-6 h-6"/>
                        <ArrowDownZA className="hover:bg-gray-600 hover:text-white rounded-md w-6 h-6"/>
                        <ArrowUpAZ className="hover:bg-gray-600 hover:text-white rounded-md w-6 h-6"/>
                    </div>

                </div>
                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" >
                        {pokemonList && pokemonList.length > 0 && pokemonList.map((item, index) => (
                            <Card key={index} id={item.id} name={item.name} type={item.type} />
                            // <p key={index}>{item.id}</p>
                        ))}
                        {pokemonList && pokemonList.length === 0 && !loading && <p>No pokemons</p>}
                    </div>
                </div>

                <div className="flex justify-center items-center" ref={loader}>
                    {loading && <div
                        className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
                    ></div>}
                </div>

            </div>

        </>
    )
}

export default CardListView