import React from 'react'
import { useChatStore } from '../store/useChatStore'

export default function ActiveTabSwitch() {
  const {activeTab, setActiveTab} = useChatStore();
  return (
    <div  className='tabs tabs-boxed  p-2 m-2'>
      <button onClick={() => setActiveTab("chats")}
      className={`tab font-medium ${activeTab == "chats" ? "bg-[#1EB854] text-black" : "text-slate-400"}` }
      >Chats</button>
      <button onClick={() => setActiveTab("allUsers")}
      className={`tab font-medium ${activeTab == "allUsers" ? "bg-[#1EB854] text-black" : "text-slate-400"}` }
      >All Users</button>
    </div>
  )
}
