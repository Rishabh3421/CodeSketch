import ImageUpload from '@/components/imageUpload'
import React from 'react'

function Dashboard() {
    return (
        <div className='xl:px-20'>
            <h2 className='text-2xl font-bold'>Convert Sketch to Code</h2>
            <ImageUpload />
        </div>
    )
}

export default Dashboard