import React from 'react'
import { useChatStore } from '../store/useChatStore.js';
import ProfileHeader from "../components/ProfileHeader.jsx";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ChatsList from "../components/ChatsList.jsx";
import AllUserLists from "../components/AllUserLists.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoConversationPlaceHolder from "../components/NoConversationPlaceHolder.jsx";

export default function Chat() {
  const {activeTab, selectedUser} = useChatStore();
  return (
    <div className='flex relative w-full max-w-6xl  h-[650px]'>
      {/*Left Side*/}
      <div className='w-80 h-full bg-base-300 backdrop-blur-sm flex flex-col'>
        <ProfileHeader/>
        <ActiveTabSwitch/>
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {activeTab === "chats" ? <ChatsList /> : <AllUserLists />}
        </div>
      </div>
      {/*Right Side*/}
      <div className='flex-1 flex flex-col bg-base-100 backdrop-blur-sm'>
        {selectedUser ? <ChatContainer/> : <NoConversationPlaceHolder/> }
      </div> 


    </div>
  )
}
