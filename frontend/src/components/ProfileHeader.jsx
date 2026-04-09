import React from 'react'
import { useState, useRef } from 'react';
import {LogOutIcon, VolumeOffIcon, Volume2Icon} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";
import {useChatStore} from "../store/useChatStore.js";
 


export default function ProfileHeader() {
  const {logout, authUser, updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = async (e) => {
    const file  = e.target.files[0];
    if(!file) return
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async() => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic: base64Image});
    };
  };
  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
         <div className='avatar online'>
          <button className='size-14 rounded-full overflow-hidden relative'
            onClick={() => fileInputRef.current.click()}
          ><img src={selectedImg || authUser.profilePic || "/avatar.png"} alt="User Image"
           className='size-full object-cover'/>
           <div className='absolute inset-0 bg-black/50 opacity-0 hover:opacity-100
           flex items-center justify-center transition-opacity'>
            <span className='text-white text-xs'>Change</span>
           </div>
           </button>
          <input type="file" accept='image/*' 
            ref={fileInputRef}
            onChange={handleImageUpload}
            className='hidden'
          />
         </div> 
         <div>
          <h3 className='base-content font-medium text-base max-w-[180px] truncate'>
            {authUser.fullName}
          </h3>
          <p className='neutral-content text-xs'>Online</p>
         </div>
        </div>
        {/*<label className="swap swap-rotate cursor-pointer ">
          
          <input type="checkbox" className="theme-controller" value="forestLight" />

          
          <svg
            className="swap-off h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          
          <svg
            className="swap-on h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label> */}
        <div className='flex gap-4 items-center'>
          <button className='text-base hover:text-neutral transition-colors '
          onClick={logout}
          > <LogOutIcon className='size-5'/></button>  
        </div>  
      </div>   
    </div>
  )
}
