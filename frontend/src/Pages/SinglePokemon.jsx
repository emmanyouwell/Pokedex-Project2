import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSinglePokemon } from '../redux/actions/pokedexAction'
import colorType from '../data/colorType.json'
import { ArrowLeft, ArrowRight, HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import AOS from 'aos';
import Loader from '../components/Loader'
const SinglePokemon = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [, setImageError] = useState(false)
  const { pokemonDetails, loading, error } = useSelector(state => state.pokedex)
  useEffect(() => {
    dispatch(getSinglePokemon(id))
  }, [dispatch, id])
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      easing: "ease-in-out", // Animation easing
    });
  }, []);
  const formatNumber = (num) => num.toString().padStart(3, "0");
  const formattedName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  if (loading && imageLoaded) {
    return (<div className="w-full h-screen flex items-center justify-center "><Loader /></div>)
  }
  if (error) {
    return <h1>{error}</h1>
  }
  return (

    <div className="" style={{ backgroundColor: colorType[pokemonDetails.types && formattedName(pokemonDetails.types[0].type.name)] }}>

      <Link to="/">
        <HomeIcon className="absolute h-10 w-10 lg:h-16 lg:w-16 lg:p-4 top-4 left-4 text-white hover:cursor-pointer hover:bg-slate-100/50 z-20  rounded-lg" />
      </Link>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center relative">
          <h1 className="text-[2.5rem] font-parkinsans font-bold text-white mt-4" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>{pokemonDetails.name && formattedName(pokemonDetails.name)}</h1>
          <p className='font-parkinsans text-white' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>#{pokemonDetails.id}</p>

          <div className="flex items-center justify-around p-4 w-full h-full">
            <Link to={id > 2 ? `/pokemon/${parseInt(id) - 1}` : `/pokemon/${parseInt(id)}`} >
              <ArrowLeft className="h-10 w-10 lg:h-20 lg:w-20 hover:bg-slate-100/50 rounded-lg text-white cursor-pointer" />
            </Link>
            <div style={{ height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {!imageLoaded && <div className="w-full h-full flex items-center justify-center"><Loader /></div>}
              <img
                loading="eager"
                data-aos="fade-down"
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatNumber(id)}.png`}
                alt={pokemonDetails.name}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{
                  maxHeight: "100%",  // Ensures the image never overflows the container
                  maxWidth: "100%",   // Keeps image responsive
                  objectFit: "contain", // Ensures the full image fits within the container
                  opacity: imageLoaded ? 1 : 0,  // Fades in once loaded
                  transition: "opacity 0.5s ease-in-out"
                }}
              />
            </div>



            <Link to={id < 1025 ? `/pokemon/${parseInt(id) + 1}` : `/pokemon/${parseInt(id)}`} >
              <ArrowRight className="h-10 w-10 lg:h-20 lg:w-20 hover:bg-slate-100/50 rounded-lg text-white cursor-pointer" />
            </Link>
          </div>


          <div className="custom-shape-divider-bottom-1740804715">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className="shape-fill"></path>
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center bg-white p-8 w-full">
          <div className="flex items-center justify-center gap-4">
            {pokemonDetails.types && pokemonDetails.types.length > 0 && pokemonDetails.types.map((item) => { return (<div key={item.type.name} style={{ backgroundColor: colorType[formattedName(item.type.name)] }} className="rounded-full px-10 py-2 text-white font-parkinsans font-bold">{formattedName(item.type.name)}</div>) })}
          </div>



          <div className="flex items-center justify-between gap-4">
            <h3 className="font-parkinsans">Weight: {pokemonDetails.weight} kg</h3>
            <span> | </span>
            <h3 className="font-parkinsans">Height: {pokemonDetails.height} m</h3>
          </div>

          <div className="w-full lg:w-[50%] transition-all">

            {pokemonDetails.stats && pokemonDetails.stats.length > 0 && pokemonDetails.stats.map((stat) => (
              <div key={stat.stat.name} className="grid grid-cols-3 gap-4">
                <h3 className="font-parkinsans">{formattedName(stat.stat.name)}</h3>
                <h3 className="font-parkinsans">{stat.base_stat}</h3>
                <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-gray-300 font-sans text-xs font-medium">
                  <div style={{ width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: colorType[pokemonDetails.types && formattedName(pokemonDetails.types[0].type.name)] }} className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-gray-900 text-white"></div>
                </div>
              </div>
            ))}

          </div>
          <div className="font-parkinsans">
            Weaknesses:
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {pokemonDetails.weakness && pokemonDetails.weakness.length > 0 && pokemonDetails.weakness.map((weakness) => (
              <span key={weakness} className="font-parkinsans text-lg text-center" style={{ color: colorType[weakness], textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)" }}>
                {weakness}
              </span>))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePokemon