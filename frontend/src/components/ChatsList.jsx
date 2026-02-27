import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import UsersLoadingSkeleton from '../components/UserLoadingSkeleton.jsx';
import NoChatsFound from "../components/NoChatFound.jsx";
import { useAuthStore } from '../store/useAuthStore.js';

export default function ChatsList() {
  const {isUserLoading, chats, getAllChats, setSelectedUser} = useChatStore();
  const {onlineUser} = useAuthStore();
  useEffect(() => {
   getAllChats(); 
  }, [getAllChats])
  if(isUserLoading) return <UsersLoadingSkeleton />
  if(chats.length === 0) return <NoChatsFound/>
  return (
    <>
      {
        chats.map((chat) => (
          <div
            key={chat._id}
            className='bg-green-500/10 p-4 rounded-lg cursor-pointer hover:bg-green-500/20
            transition-colors'
            onClick={() => setSelectedUser(chat)}
          >
            <div className='flex items-center gap-3'>
              <div className={`avatar ${onlineUser.includes(chat._id) ?"online" : "offline" }`}>
                <div className='size-12 rounded-full'>
                  <img className='object-cover rounded-full' src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                </div>
              </div>
              <h4 className='text-slate-200 font-medium truncate'>{chat.fullName}</h4>
            </div>
          </div>
        ))
      }
    </>
  )
}
