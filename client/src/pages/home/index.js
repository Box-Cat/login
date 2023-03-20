import React from 'react'
import ChatArea from './components/ChatArea'
import UserSearch from './components/UserSearch'
import { useState, useEffect } from 'react'
import UsersList from './components/UsersList'
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client'

const Home = () => {
  const socket = io("http://localhost:5000");
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat } = useSelector((state) => state.userReducer);

 useEffect(()=>{
  
      socket.emit("send-new-message-to-all",{message: "Hi from Arjun"})

      socket.on("new-message-from-server",(data=>{
        console.log(data);
      }))
 },[]);


  return (
    <div className='flex gap-5'>
      <div className='w-96'>
        <UserSearch
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
        <UsersList
          searchKey={searchKey}
        />
      </div>
      <div className='w-full'>
        {selectedChat && <ChatArea />}
      </div>
    </div>
  )
}

export default Home