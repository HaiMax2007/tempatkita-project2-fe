import React from 'react'
import { Link } from 'react-router-dom'
import { CURRENT_PROJECT } from '../utils'

const Home = () => {
  return (
    <div className='min-h-screen home-bg text-white py-20 px-10'>
      <div className="flex flex-col items-center gap-5">
        <h1 className='font-bold text-5xl capitalize text-center'>PKL Portofolio</h1>
        <p className='text-xl text-center max-w-[1000px]'>Jelajahi koleksi project digital terbaik kami. Dari web application hingga mobile app, setiap karya dibuat dengan passion dan teknologi terdepan untuk menciptakan pengalaman user yang luar biasa.</p>
      </div>
      <div className="grid grid-cols-3 max-w-[1500px] mx-auto mt-20 gap-5 w-fit">
        {
          CURRENT_PROJECT.map(p => (
            <Link to={p.url} className="p-4 flex flex-col rounded-xl gap-5 bg-[#18243b]">
              <img src={p.img} alt={p.name} className='rounded-xl w-full h-[200px] object-cover' />
              <div className="flex flex-col justify-between gap-5">
                <div className="space-y-2">
                  <h2 className='font-semibold text-xl'>{p.name}</h2>
                  <p className='text-sm text-white/40 max-w-[400px]'>{p.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {
                    p.techno.slice(0, 3).map(t => (
                      <span className='bg-[#24375B] py-1 px-2 rounded-lg'>{t}</span>
                    ))
                  }
                  {
                    p.techno.length > 3 && (
                      <span className='bg-[#24375B] py-1 px-2 rounded-lg'>+{p.techno.length - 3}</span>
                    )
                  }
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Home