import React from 'react'
import { useChatStore } from '../store/useChatStore.js';
import ProfileHeader from "../components/ProfileHeader.jsx";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ChatsList from "../components/ChatsList.jsx";
import AllUserLists from "../components/AllUserLists.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoConversationPlaceHolder from "../components/NoConversationPlaceHolder.jsx";
import { useState, useEffect } from 'react';

export default function Chat() {
  const { activeTab, selectedUser, getCurrentSharedKey } = useChatStore();
  useEffect(() => {
    if(selectedUser) {
      getCurrentSharedKey();
    }
  },[selectedUser])

  return (
    <div className='h-[100vh] w-full overflow-hidden bg-base-100'>
      <div className="drawer lg:drawer-open h-full overflow-hidden">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col h-full overflow-hidden">
          {/* RIGHT SIDE: Chat Container */}
          
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
          

          {!selectedUser && (
            <div className="absolute top-4 left-4 lg:hidden">
              <label htmlFor="my-drawer-2" className="btn btn-primary btn-sm drawer-button">
                View Chats
              </label>
            </div>
          )}
        </div>

        {/* LEFT SIDE: Sidebar */}
        <div className="drawer-side z-40">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

          <aside className='w-80 h-full bg-base-300 border-r border-base-content/10 flex flex-col'>
            <ProfileHeader />
            <ActiveTabSwitch />
            
            <div className='flex-1 overflow-y-auto p-4 space-y-2'>
              {activeTab === "chats" ? <ChatsList /> : <AllUserLists />}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}