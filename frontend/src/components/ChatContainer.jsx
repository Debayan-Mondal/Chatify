import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from '../components/ChatHeader.jsx';
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceHolder.jsx";
import MessageInput from './MessageInput.jsx';
import MessageLoadingSkeleton from './MessageLoadingSkeleton.jsx';

export default function ChatContainer() {
  const {selectedUser, getMessages, messages, isMessagesLoading, subscribeToMessage, unsubscribeFromMessage} = useChatStore();
  const {authUser} = useAuthStore();
  const [selectedImgUser, setSelectedImgUser] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessage();

    return () => unsubscribeFromMessage();
  },[selectedUser, getMessages]);
  useEffect(() => {
    if(messageEndRef.current) {
      messageEndRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [messages]);
  

  return (
    <>
      <ChatHeader />
      <dialog id="my_modal" className="modal">
          <div className="modal-box max-h-none flex flex-col items-center justify-center max-w-none h-screen w-screen">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-2xl flex gap-3 justify-center items-center absolute top-10 left-10 ">
              <div className={`avatar`}>
                    <div className='w-12 rounded-full'>
                        <img src={selectedImgUser?.profilePic || "/avatar.png"} alt={selectedImgUser?.fullName} />
                    </div>
                </div>
                {selectedImgUser?.fullName}</h3>
            <p className="py-4"><img src={selectedImg} alt="Shared" className='rounded-lg  aspect-auto lg:w-[50vw] md:w-[60vw] sm:w-full object-cover' /></p>
          </div>
        </dialog>
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {
          messages.length && !isMessagesLoading > 0 ? (
            <div className='w-full mx-auto space-y-6 '>
              {messages.map(msg => (
                <div key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}` }
                >
                  <div className={`chat-bubble relative ${msg.senderId === authUser._id ? "bg-primary" : "bg-neutral"}`}>
                    {
                      msg.image && (
                        <>
                        <div className="cursor-pointer transition-all active:scale-95" onClick={()=>{
                          msg.senderId === authUser._id ? setSelectedImgUser(authUser) : setSelectedImgUser(selectedUser);
                          setSelectedImg(msg.image);
                          document.getElementById('my_modal').showModal();
                          }}>
                        <img src={msg.image} alt="Shared" className='rounded-lg h-48 object-cover' />
                        </div>
                        </>

                        
                      )
                    }
                    {msg.text && <p className='mt-2 text-white'>{msg.isEncypted? <span className='text-slate-300  italic'>Something Wrong with Message</span> : msg.text}</p>}
                    <p className='text-xs mt-1  flex items-center gap-1'>
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef}/>
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
