import React from 'react'
import { Info } from 'lucide-react'
const Card = ({id, name, type, img}) => {
    const formatNumber = (num) => num.toString().padStart(3, "0");
    return (
        <div className="flex flex-col gap-2 bg-white h-96 w-64 p-4 rounded-lg shadow-lg border-8 border-gray-300">
            <div className="w-full h-max flex justify-between items-center">
                <span className="text-sm">ID No.</span><span className="font-medium text-lg">#{formatNumber(id)}</span>
            </div>
            <div className="w-full h-max border-2 flex justify-center items-center">
                <img loading="lazy" src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatNumber(id)}.png`} alt="pokemon image" className="h-48" />
            </div>
            <div className="w-full h-max flex flex-col items-center p-2">
                <p className="font-medium text-blue-500 uppercase">{name}</p>
                <p>Type: {type && type.length > 0 && type.map((item)=>(item.type.name)).join(' | ')}</p>
            </div>
            <div className="relative flex justify-center items-center gap-2 group transition-all hover:cursor-pointer">
                <span className="text-md font-medium text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all">Learn more</span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max text-slate-400 group-hover:text-blue-500 group-hover:translate-x-8 transition-all">
                    <Info className="h-8 w-8"/>
                </div>

            </div>
        </div>
    )
}

export default Card