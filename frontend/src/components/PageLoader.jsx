import React from 'react'
import { LoaderCircle } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className='h-screen flex justify-center items-center w-screen'>
      <div className='loading loading-spinner h-11 w-11'></div>
    </div>
  )
}
