import React, { useState, useEffect, useRef, useCallback } from 'react'
import Card from './Card'
import { Search, ArrowDown10, ArrowUp01, ArrowDownZA, ArrowUpAZ, X, Filter, Minus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from '../redux/actions/pokedexAction'
import { clearError } from '../redux/slices/pokedexSlice'
import { toast } from 'react-toastify'
import Loader from './Loader'

const CardListView = () => {
    //hooks
    const loader = useRef(null);

    //redux
    const dispatch = useDispatch()
    const { pokemons, count, loading, error } = useSelector(state => state.pokedex) //get pokemons from redux store

    //local states
    const [page, setPage] = useState(1); //pagination passed as offset query
    const [pokemonList, setPokemonList] = useState([]); //used to display pokemons
    const [search, setSearch] = useState(''); //used to store user input
    const [term, setTerm] = useState(''); //used to pass search query to backend
    const [isSearching, setIsSearching] = useState(false); //used to check if user is searching
    const [sort, setSort] = useState(''); //used to store type of sort
    const [idMin, setIdMin] = useState(1); //used to store min id
    const [idMax, setIdMax] = useState(1025); //used to store max id
    const [nameMin, setNameMin] = useState(''); //used to store min name
    const [nameMax, setNameMax] = useState(''); //used to store max name
    const [show, setShow] = useState(false); //used to toggle filter options
    const [min, setMin] = useState(''); //used to pass min query to backend
    const [max, setMax] = useState(''); //used to pass max query to backend


    // functions/helpers

    const resetFilters = () => {
        setIdMin(1);
        setIdMax(1025);
        setNameMin('');
        setNameMax('');
        setMin('');
        setMax('');
        setPage(1);
        setSort('');
        setSearch('');
        setTerm('');
        setIsSearching(false);
        setShow(false);
    }

    const filterByID = () => {
        if (idMin > 0 && idMax <= 1025) {
            setMin(idMin);
            setMax(idMax);

            setPage(1);
            setNameMin('');
            setNameMax('');
        }
        else {
            toast.error("Range should not exceed 1-1025.", { position: "bottom-right" });
        }
    }

    const filterByName = () => {
        if (nameMin && nameMax) {
            if (nameMin.toUpperCase().localeCompare(nameMax.toUpperCase()) <= 0) { // if nameMin is less than or equal to nameMax
                setMin(nameMin.toUpperCase());
                setMax(nameMax.toUpperCase());
            } else {
                toast.error("Start name should be less than or equal to the end name.", { position: "bottom-right" });
                return;
            }

            setPage(1);
            setIdMin(1);
            setIdMax(1025);
        }
        else {
            toast.error("Please enter both start and end name range.", { position: "bottom-right" });
        }

    }

    const sortIDDesc = () => {
        if (page === 1 && sort === 'idDesc') {
            return;
        }
        setSort('idDesc');
        setPage(1);

    }

    const sortIDAsc = () => {
        if (page === 1 && sort === 'idAsc') {
            return;
        }
        setSort('idAsc');
        setPage(1);
    }

    const sortNameDesc = () => {
        if (page === 1 && sort === 'nameDesc') {
            return;
        }
        setSort('nameDesc');
        setPage(1);
    }

    const sortNameAsc = () => {
        if (page === 1 && sort === 'nameAsc') {
            return;
        }
        setSort('nameAsc');
        setPage(1);
    }

    //submit search query
    const handleSubmit = () => {
        setIsSearching(search.length > 0);
        setPage(1);
        setTerm(search);
        if (search.length === 0) {
            setSort('');
            setPage(1);
        }
    }

    //fetch next pokemons
    const fetchNextPokemon = useCallback(() => {
        console.log("Fetching: ", page);
        setTimeout(() => {
            if ((page * 10) > count - 1) { //checks if page exceeds total pages
                return;
            }
            setPage((prevPage) => prevPage + 1);
        }, 1000)
    }, [page, count])



    // useEffects

    useEffect(() => { //used to fetch next pokemon when user scrolls to the bottom
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && pokemonList.length > 0) {
                    fetchNextPokemon()
                }
            },
            { threshold: 1 }
        );
        const target = loader.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [isSearching, sort, loading, pokemonList, fetchNextPokemon]);

    useEffect(() => { //main useEffect to fetch pokemons
        dispatch(getPokemons({ search: term, offset: page, sort: sort, min, max }))
    }, [dispatch, page, sort, min, max, term]);

    useEffect(() => {
        setPokemonList([])
    }, [sort, min, max, term])

    useEffect(() => { //clear redux errors states
        if (error) {
            dispatch(clearError())
        }
    }, [error, dispatch])

    useEffect(() => { //set pokemons to local state to display

        if (pokemons && pokemons.length > 0) {
            setPokemonList((prevPokemons) => [...prevPokemons, ...pokemons])
        }
        else if (search) {
            setPokemonList([pokemons])
        }
    }, [pokemons, search])


    return (
        <div className='flex flex-col w-full gap-4 min-h-screen' onScroll={fetchNextPokemon}>
            <div className="sticky top-0 z-10 w-full bg-gray-400 flex flex-col lg:flex-row gap-4 justify-center items-center p-4">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 w-max">

                    {/* search input */}
                    <div className="relative flex w-max gap-2 md:w-max">
                        <input type="text" name="search" value={search} placeholder="Search name or ID (e.g. Bulbasaur or 1) " id="search" className="max-w-[358px] lg:min-w-[358px] h-8 border-2 border-gray-800 rounded-lg p-4 pr-10" onChange={(e) => setSearch(e.target.value)} />
                        {loading ? <Search className="h-6 w-6 !absolute right-1 top-1 rounded text-gray-700/30" /> : <Search className="h-6 w-6 !absolute right-1 top-1 rounded text-gray-700/50 hover:text-gray-700 transition-all hover:cursor-pointer" onClick={handleSubmit} />}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        {/* sort input */}
                        <div className="flex items-center justify-center gap-2 border-2 border-gray-800 rounded-lg p-2">
                            <span className="font-semibold">Sort: </span>
                            <div className="group relative inline-block">
                                {sort === 'idDesc' ? <ArrowDown10 className="bg-gray-600 hover:cursor-pointer text-white rounded-md w-6 h-6" onClick={sortIDDesc} /> : <ArrowDown10 className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortIDDesc} />}
                                <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">Sort by ID (Desc)</span>
                            </div>
                            <div className="group relative inline-block">
                                {sort === 'idAsc' ? <ArrowUp01 className="bg-gray-600 hover:cursor-pointer text-white rounded-md w-6 h-6" onClick={sortIDAsc} /> : <ArrowUp01 className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortIDAsc} />}
                                <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">Sort by ID (Asc)</span>
                            </div>
                            <div className="group relative inline-block">
                                {sort === 'nameDesc' ? <ArrowDownZA className="bg-gray-600 hover:cursor-pointer text-white rounded-md w-6 h-6" onClick={sortNameDesc} /> : <ArrowDownZA className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortNameDesc} />}
                                <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">Sort by Name (Desc)</span>
                            </div>
                            <div className="group relative inline-block">
                                {sort === 'nameAsc' ? <ArrowUpAZ className="bg-gray-600 hover:cursor-pointer text-white rounded-md w-6 h-6" onClick={sortNameAsc} /> : <ArrowUpAZ className="hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-md w-6 h-6" onClick={sortNameAsc} />}
                                <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">Sort by Name (Asc)</span>
                            </div>

                        </div>

                        {/* filter input */}
                        {!show && <div className="group relative inline-block">
                            <button className="bg-gray-800 text-white rounded-lg p-2 hover:bg-gray-600" onClick={() => setShow(!show)}><Filter /></button>
                            <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-28 lg:translate-y-20 bottom-full mb-2  max-w-xs whitespace-normal lg:w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">More Filters</span>
                        </div>}
                        {/* reset filters */}
                        {!show && <div className="group relative inline-block">
                            <div className="bg-red-600 text-white rounded-lg p-2 hover:bg-red-800 h-full border-2 border-gray-800" onClick={resetFilters} onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Prevent page scroll on Space
                                    resetFilters();
                                }
                            }}
                                tabIndex={0}><X /></div>
                            <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-28 lg:translate-y-20 bottom-full mb-2 text-center px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity max-w-xs whitespace-normal lg:w-max">Reset Filters</span>
                        </div>}
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
                    {/* Filter by ID and Name inputs */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-2">

                        {show && <>
                            <div className="relative flex flex-col lg:grid lg:grid-cols-2 w-full gap-2">
                                {/* Filter by ID */}
                                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 border-2 w-full border-gray-800 rounded-lg p-2">
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className="font-semibold">Min: </span>
                                        <input type="text" name="id_min" value={idMin} placeholder="0" id="idMin" className="max-w-[100px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => setIdMin(e.target.value)} />
                                    </div>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className="font-semibold">Max: </span>
                                        <input type="text" name="id_max" value={idMax} placeholder="1025" id="idMax" className="max-w-[100px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => setIdMax(e.target.value)} />
                                    </div>
                                    <button className="bg-gray-800 text-white rounded-lg p-2 hover:bg-gray-600" onClick={filterByID}>Filter by ID</button>
                                </div>

                                {/* Filter by Name */}
                                <div className="flex flex-col w-full lg:flex-row items-center justify-center gap-4 border-2 border-gray-800 rounded-lg p-2 ">
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className="font-semibold">Min: </span>
                                        <input type="text" maxLength={1} pattern="[A-Za-z]" name="name_min" value={nameMin} placeholder="A" id="nameMin" className="max-w-[100px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => {
                                            const inputValue = e.target.value.toUpperCase();
                                            if (/^[A-Za-z]?$/.test(inputValue)) {
                                                setNameMin(inputValue);
                                            }
                                        }} />
                                    </div>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className="font-semibold">Max: </span>
                                        <input type="text" maxLength={1} pattern="[A-Za-z]" name="name_max" value={nameMax} placeholder="Z" id="nameMax" className="max-w-[100px] h-8 border-2 rounded-lg p-2 pr-10" onChange={(e) => {
                                            const inputValue = e.target.value.toUpperCase();
                                            if (/^[A-Za-z]?$/.test(inputValue)) {
                                                setNameMax(inputValue);
                                            }
                                        }} />
                                    </div>
                                    <button className="bg-gray-800 text-white lg:text-sm rounded-lg p-2 hover:bg-gray-600" onClick={filterByName}>Filter by Name</button>
                                </div>
                            </div>
                            {/* Reset and Minimize Buttons */}
                            <div className="flex items-center justify-center gap-4 w-max">
                                <div className="group relative inline-block">
                                    <div className="bg-red-600 text-white rounded-lg p-2 hover:bg-red-800 h-full border-2 border-gray-800" onClick={resetFilters} onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault(); // Prevent page scroll on Space
                                            resetFilters();
                                        }
                                    }}
                                        tabIndex={1}><X /></div>
                                    <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Reset Filters</span>
                                </div>
                                <div className="group relative inline-block">
                                    <div className="bg-gray-600 text-white rounded-lg p-2 hover:bg-gray-800 h-full border-2 border-gray-800" onClick={() => setShow(false)} onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault(); // Prevent page scroll on Space
                                            setShow(false);
                                        }
                                    }}
                                        tabIndex={2}><Minus /></div>
                                    <span className="absolute hidden group-hover:inline-block left-1/2 transform -translate-x-1/2 translate-y-20 bottom-full mb-2 w-max px-2 py-1 text-white text-sm bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">Minimize</span>
                                </div>
                            </div> </>}

                    </div>
                </div>
            </div>

            {/* Custom card view list and card components */}
            <div className="flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" >
                    {pokemonList && pokemonList.length > 0 && pokemonList.map((item, index) => (
                        <Card key={`${index}_${item.id}_${item.name}`} id={item.id} name={item.name} type={item.type} />
                    ))}
                    {pokemonList && pokemonList.length === 0 && !loading && <p>No pokemons</p>}
                </div>
            </div>

            {/* loader */}
            <div className="flex justify-center items-center" ref={loader}>
                {loading && <Loader />}
            </div>

        </div>
    )
}

export default CardListView