import React from 'react'
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { CreateNewChat } from '../../../apicalls/chats';
import { HideLoader, ShowLoader } from '../../../redux/loaderSlice';
import { SetAllChats, SetSelectedChat } from '../../../redux/userSlice';
import moment from 'moment';

const UsersList = ({ searchKey }) => {
  const { allUsers, allChats, user, selectedChat } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader);
      const response = await CreateNewChat([user._id, receipentUserId]);
      dispatch(HideLoader);
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(SetAllChats(updatedChats));
        dispatch(SetSelectedChat(newChat));
      }
    } catch (error) {
      dispatch(ShowLoader);
      toast.error(error.message);
      dispatch(HideLoader);
    }
  };

  const openChat = (receipentUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((mem) => mem._id).includes(user._id) &&
        chat.members.map((mem) => mem._id).includes(receipentUserId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    }
  };

  const getData = () => {
    return allUsers.filter((userObj) =>
      (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) && searchKey) || allChats.some((chat) => chat.members.map((mem) => mem._id).includes(userObj._id))
    )
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat) {
      return selectedChat.members.map((mem) => mem._id).includes(userObj._id)
    }
    return false
  };

  const getLastMsg = (userObj) => {
    const chat = allChats.find(
      (chat) => chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMsgPerson = chat?.lastMessage?.sender === user._id ? "You : " : "";
      return (
        <div className='flex justify-between w-full'>
          <h1 className='text-gray-600 text-sm'> ${lastMsgPerson} ${chat.lastMessage?.text} </h1>
          <h1 className='text-gray-500 text-sm'>
            {moment(chat?.lastMessage.createdAt).format("hh:mm:A")}
          </h1>
        </div>
      );
    }
  }

  return (
    <div className='flex flex-col gap-3 mt-5 w-96'>
      {getData()
        .map((userObj) => {
          return (
            <div className={`shadow border p-3 rounded-xl bg-white flex justify-between items-center cursor-pointer w-full
               ${getIsSelectedChatOrNot(userObj) && 'border-primary border-2'} 
            `}
              key={userObj._id}
              onClick={() => openChat(userObj._id)}
            >
              <div className='flex gap-5 items-center w-full'>
                {userObj.profilePic && (
                  <img
                    src={userObj.profilePic}
                    alt="profile pic"
                    className='w-10 h-10 rounded-full'
                  />
                )}
                {!userObj.profilePic && (
                  <div className='bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center'>
                    <h1 className='uppercase text-xl font-semibold text-white'>{userObj.name[0]}</h1>
                  </div>
                )}
                <div className='flex flex-col gap-1 w-full'>
                  <h1> {userObj.name}</h1>
                  {getLastMsg(userObj)}
                </div>
              </div>
              <div onClick={() => createNewChat(userObj)}>
                {!allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id))
                  && (<button className='border-primary border text-primary bg-white p-1 rounded'>
                    Create Chat
                  </button>)}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default UsersList