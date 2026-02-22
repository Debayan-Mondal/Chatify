import React from 'react'
import { Route, Routes } from 'react-router'
import Chat from "./pages/Chat.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import { useAuthStore } from './store/useAuthStore.js'

export default function App() {
  const {name, isLoading, load} = useAuthStore();
  console.log(name);
  console.log(isLoading);
  return (
    <div className='min-h-screen bg-slate-900 relative flex justify-center items-center
    p-4 overflow-hidden'>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b2e1b2e_1px,transparent_1px),linear-gradient(to_bottom,#1b2e1b2e_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute top-0 -left-10 size-[500px] bg-green-900 opacity-30 blur-[120px]" />
      <div className="absolute bottom-10 right-10 size-[400px] bg-emerald-600 opacity-10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-stone-900/20" />
      <Routes>
        <Route path="/" element={<Chat/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </div>
  )
}
