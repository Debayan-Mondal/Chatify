import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Chat from "./pages/Chat.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import { useAuthStore } from './store/useAuthStore.js'
import PageLoader from './components/PageLoader.jsx'
import {Toaster} from "react-hot-toast";

export default function App() {
  const {authUser, isChecking, checkAuth} = useAuthStore();
  console.log(authUser);
  useEffect(() => {
    checkAuth()
  },[checkAuth]);

  if(isChecking) return <PageLoader/>

  return (
    <div className='min-h-screen bg-slate-900 relative flex justify-center items-center
    p-4 overflow-hidden'>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b2e1b2e_1px,transparent_1px),linear-gradient(to_bottom,#1b2e1b2e_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute top-0 -left-10 size-[500px] bg-green-900 opacity-30 blur-[120px]" />
      <div className="absolute bottom-10 right-10 size-[400px] bg-emerald-600 opacity-10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-stone-900/20" />
      <Routes>
        <Route path="/" element={authUser ? <Chat/> : <Navigate to={"/login"}/>}/>
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to={"/"}/>}/>
        <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to={"/"}/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}
