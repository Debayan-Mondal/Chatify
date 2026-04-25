import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from '../components/ChatHeader.jsx';
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceHolder.jsx";
import MessageInput from './MessageInput.jsx';
import MessageLoadingSkeleton from './MessageLoadingSkeleton.jsx';
import { BrainCircuit } from 'lucide-react';

export default function ChatContainer() {
  const {selectedUser, getMessages, messages, isMessagesLoading, subscribeToMessage, unsubscribeFromMessage, getCurrentSharedKey, summarizeMessage,isSummaryLoading, extendNlpWithLocalPlaces } = useChatStore();
  const {authUser} = useAuthStore();
  const [selectedImgUser, setSelectedImgUser] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const messageEndRef = useRef(null);
  const [menuData, setMenuData] = useState({visibility: false, x:null, y:null, message: null});
  const [summaryPanelData, setSummaryPanelData] = useState({visibility: false, x:null, y:null});
  const [summarizedText, setSummarizedText] = useState("");

  useEffect(() => {
    const closeMenu = () => setSummaryPanelData({...summaryPanelData, visibility: false});
    window.addEventListener('click', closeMenu);
    return () => {window.removeEventListener('click', closeMenu)};
  },[summaryPanelData]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  },[selectedUser, getMessages]);

  useEffect(() => {
    const closeMenu = () => setMenuData({...menuData, visibility:false, message:null});
    window.addEventListener('click', closeMenu);
    return () => {window.removeEventListener('click', closeMenu)};
  }, [menuData])

  useEffect(() => {
    if(messageEndRef.current) {
      messageEndRef.current.scrollIntoView({behaviour: "smooth"});
    }
  }, [messages]);
  useEffect(() => {
    extendNlpWithLocalPlaces();
  },[])
  
  const menuHandler = (event, msg) => {
    event.preventDefault();
    setSummaryPanelData({...summaryPanelData, visibility: false});
    setMenuData({visibility: true, x: event.pageY, y: event.pageX, message:msg})
  }

  const summarizeHandler = async(event) => {
    event.stopPropagation();
    setMenuData({...menuData, visibility: false});
    setSummaryPanelData({x:event.pageY,y: event.pageX, visibility:true});
    const summarizedMessage = await summarizeMessage(menuData.message);
    setSummarizedText(summarizedMessage);
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
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
            <p className="py-4 "><img src={selectedImg} alt="Shared" className='rounded-lg  max-h-96 aspect-auto lg:w-[50vw] md:w-[60vw] sm:w-full object-contain' /></p>
          </div>
      </dialog>
      {
        summaryPanelData.visibility && 
        <div className='w-56  fixed z-20 min-h-20 bg-base-200 rounded-box pl-5 pr-5 pt-2 pb-2 flex flex-col items-center ' style={{top: menuData.x, left: menuData.y}}>
          <h1 className='text-slate-400 text-lg w-full text-left flex gap-1'><BrainCircuit />Sumarized Text</h1>
          <div className="divider my-0"></div>
          {
            isSummaryLoading ? <div className='h-24 flex items-center'><progress className="progress progress-primary w-20 h-1.5"></progress></div>
            : <div className='text-sm'>{summarizedText}</div>
          }
        </div>
      }
      
      {menuData.visibility && 
        <div className='fixed z-20' style={{top: menuData.x, left: menuData.y}}>
          <ul className='menu bg-base-200 rounded-box w-56'>
            <li><a onClick={summarizeHandler} ><BrainCircuit className='size-5' /><span>Summarize</span></a></li>
          </ul>
        </div>
      }
      
      <div className='flex-1 min-h-0 px-6 overflow-y-auto py-8'>
        {
          !isMessagesLoading && messages.length > 0 ? (
            <div className='w-full mx-auto space-y-6 '>
              {messages.map(msg => (
                <div key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}` }
                >
                  <div onContextMenu={() => {menuHandler(event, msg)}} className={`sm:max-w-96 max-w-60 chat-bubble relative ${msg.senderId === authUser._id ? "bg-primary" : "bg-neutral"}`}>
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
    </div>
  )
}
