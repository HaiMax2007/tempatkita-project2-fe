import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
        <h1 className='font-bold text-5xl capitalize'>This is the Home of our project</h1>
        <p className='text-xl mt-2'>Homepage's still being maintainence, below are the links to our project</p>
        <ul className='mt-10 text-blue-600 font-semibold space-y-5'>
            <li>
                <Link className='hover:bg-blue-600 hover:text-white transition border-blue-600 border-2 p-2' to={'/chest-classify'}>Chest Classifcation</Link>
            </li>
            <li>
                <Link className='hover:bg-blue-600 hover:text-white transition border-blue-600 border-2 p-2' to={'/brain-classify'}>Brain Classifcation</Link>
            </li>
        </ul>
    </div>
  )
}

export default Home