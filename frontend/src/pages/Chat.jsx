import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

export default function Chat() {
  const {logout} = useAuthStore();
  return (
    <div className='z-10'>
      <button onClick={logout} className='btn btn-primary'>LogOut</button>
      chatpage
    </div>
  )
}
