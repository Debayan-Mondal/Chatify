import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from '../components/ChatHeader.jsx';
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceHolder.jsx";
import MessageInput from './MessageInput.jsx';
import MessageLoadingSkeleton from './MessageLoadingSkeleton.jsx';

export default function ChatContainer() {
  const {selectedUser, getMessages, messages, isMessagesLoading} = useChatStore();
  const {authUser} = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  },[selectedUser, getMessages]);
  console.log(messages);
  return (
    <>
      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {
          messages.length && !isMessagesLoading > 0 ? (
            <div className='max-w-3xl mx-auto space-y-6 '>
              {messages.map(msg => (
                <div key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}` }
                >
                  <div className={`chat-bubble relative ${msg.senderId === authUser._id ? "bg-primary" : "bg-accent-content"}`}>
                    {
                      msg.image && (
                        <img src={msg.image} alt="Shared" className='rounded-lg h-48 object-cover' />
                      )
                    }
                    {msg.text && <p className='mt-2 text-white'>{msg.text}</p>}
                    <p className='text-xs mt-1  flex items-center gap-1'>
                      {new Date(msg.createdAt).toISOString().slice(11, 16)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : isMessagesLoading ? (<MessageLoadingSkeleton/>) : (
            <NoChatHistoryPlaceHolder name={selectedUser.fullName}/>
          )
        }
      </div>
      <MessageInput/>
    </>
  )
}
