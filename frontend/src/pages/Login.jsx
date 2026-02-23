import React, { useState } from 'react'
import { MessageCircleCode, Mail, RectangleEllipsis } from 'lucide-react';
import PageLoader from "../components/PageLoader.jsx";
import { data, Link } from "react-router";
import { useAuthStore } from '../store/useAuthStore';


export default function Login() {
  const [formData, setFormData] = useState({email:"", password: ""})
  const {isLogging, login} = useAuthStore();
  const handleSubmit = (event) => {
    event.preventDefault();
    login(formData);
  };
  return (
    <div className='z-10 w-[850px] flex justify-center items-center p-1 bg-base-100 rounded-lg'>
      <div className='relative w-full  md:h-auto h-[auto]'>
        <div className='w-full flex  flex-col md:flex-row'>
          <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30'>
            <div className='w-full max-w-md'>
              <div className='text-center mb-2'>
                <MessageCircleCode className='h-12 w-12 mx-auto text-slate-400 mb-4'/>
                <h2 className='text-2xl font-bold text-slate-200 mb-2'>Welcome Back!</h2>
                <p className='text-slate-400'>Log into account</p>
              </div>
              <form onSubmit={handleSubmit} className='space-y-6 mb-3'>
                <div>
                  <label className='auth-input-label'>Email</label>
                  <div className='relative input input-primary gap-1 flex items-center'>
                    <Mail/>
                    <input type="text" value={formData.email}
                      onChange={(event) => setFormData({...formData, email: event.target.value})}
                      placeholder='johndoe@gmail.com'
                    />
                  </div>
                </div>
                <div>
                  <label className='auth-input-label'>Password</label>
                  <div className='relative input input-primary gap-1 flex items-center'>
                    <RectangleEllipsis />
                    <input type="password"
                      value={formData.password}
                      onChange={(event) => setFormData({...formData, password: event.target.value})} 
                      placeholder='*****'
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLogging} className='btn btn-primary w-full'>Submit</button>
                {isLogging ? (<PageLoader/>) : ("Create Account")}
              </form>
              <Link to="/signup">
                <button className='btn btn-outline btn-info'>Don't have an Acount? Log in!</button>
              </Link>
            </div>
          </div>

          <div className='hidden md:w-1/2 md:flex flex-col items-center justify-center p-6'>
            <img src="/Signup.png" alt="" className='h-full w-full object-contain' />
            <div className='mt-6 text-center'>
              <h3 className='text-xl font-medium text-cyan-200'>Connect anytime, anywhere</h3>
              <div className='mt-4 flex justify-center gap-4'>
                <span className='auth badge h-10 w-20 bg-info text-black'>Free</span>
                <span className='auth badge h-10 w-20 p-1 bg-accent text-black'>Easy Setup</span>
                <span className='auth badge h-10 w-20 bg-warning text-black'>Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
