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
    const [sort, setSort] = useState('');

    const sortIDDesc = () => {
        setSort('idDesc');
        setPokemonList([]);
        setSearch('');
        setIsSearching(false);
        setPage(1015);

    }
    const sortIDAsc = () => {
        setSort('idAsc');
        setPokemonList([]);
        setSearch('');
        setIsSearching(false);
        setPage(0);
    }
    const sortNameDesc = () => {
        setSort('nameDesc');
        setPokemonList([]);
        setSearch('');
        setIsSearching(false);
        setPage(0);
    }
    const sortNameAsc = () => {
        setSort('nameAsc');
        setPokemonList([]);
        setSearch('');
        setIsSearching(false);
        setPage(0);
    }
    const handleSubmit = () => {

        setIsSearching(search.length > 0);
        setPokemonList([]);
        // setSort('');
        if (search.length === 0) {
            setSort('');
            setPage(0);
            return;
        }
    }
    const fetchNextPokemon = (sort) => {
        console.log("Fetching: ", page);
        setTimeout(() => {
            if (page > 1015) {
                setHasMore(false);
                return;
            }
            switch (sort) {
                case 'idDesc':
                    setPage((prevPage) => prevPage - 10);
                    break;
                case 'idAsc':
                    setPage((prevPage) => prevPage + 10);
                    break;
                case 'nameDesc':
                    setPage((prevPage) => prevPage + 1);
                    break;
                case 'nameAsc':
                    setPage((prevPage) => prevPage + 1);
                    break;
                default:
                    setPage((prevPage) => prevPage + 10);
                    break;
            }


        }, 1000)
    }
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isSearching) {
                    fetchNextPokemon(sort)
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
    }, [isSearching, sort]);
    useEffect(() => {
        if (page) {
            console.log("page: ", page);
        }
        if (sort) {
            console.log("sort: ", sort);
        }
        if (isSearching) {
            dispatch(getPokemons({ search: search }))
        }
        else {
            dispatch(getPokemons({ offset: page, sort: sort }))
        }

    }, [page, sort, isSearching])
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


    return (
        <>
            <div className='flex flex-col gap-4 min-h-screen' onScroll={fetchNextPokemon}>
                <div className="sticky top-0 z-10 w-full bg-gray-400 flex justify-between items-center p-4">
                    <div className="relative flex w-full gap-2 md:w-max">
                        <input type="text" name="search" value={search} placeholder="Search name or ID (e.g. Bulbasaur or 1) " id="search" className="min-w-[358px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => setSearch(e.target.value)} />
                        {loading ? <Search className="h-6 w-6 !absolute right-1 top-1 rounded text-gray-700/30"  /> : <Search className="h-6 w-6 !absolute right-1 top-1 rounded text-gray-700/50 hover:text-gray-700 transition-all hover:cursor-pointer" onClick={handleSubmit} />}
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold">Sort: </span>
                        <div className="group relative inline-block">
                            <ArrowDown10 className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortIDDesc} />
                            <span className="absolute left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sort by ID (Desc)</span>
                        </div>
                        <div className="group relative inline-block">
                            <ArrowUp01 className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortIDAsc} />
                            <span className="absolute left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sort by ID (Asc)</span>
                        </div>
                        <div className="group relative inline-block">
                            <ArrowDownZA className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortNameDesc} />
                            <span className="absolute left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sort by Name (Desc)</span>
                        </div>
                        <div className="group relative inline-block">
                            <ArrowUpAZ className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortNameAsc}/>
                            <span className="absolute left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sort by Name (Asc)</span>
                        </div>

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