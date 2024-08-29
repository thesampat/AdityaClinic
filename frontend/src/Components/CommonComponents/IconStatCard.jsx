import React from 'react'

export default function IconStatCard({title, desc, icon}) {
    return (
        <div className='w-64 flex justify-between items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl' >

            <div className="" > <p>{desc}</p>  <p>{title}</p> </div>

            <span> {icon} </span>

        </div>
    )
}
