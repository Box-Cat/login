import React from 'react'
import { useEffect } from 'react'
import { GetAllUsers, GetCurrentUser } from '../apicalls/users'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { HideLoader, ShowLoader } from '../redux/loaderSlice'
import { useSelector } from 'react-redux'
import { SetUser, SetAllUsers, SetAllChats } from '../redux/userSlice'
import { GetAllChats } from '../apicalls/chats'

const ProtectedRoute = ({ children }) => {
  const {user} = useSelector(state=>state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader())
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatsReponse = await GetAllChats();
      dispatch(HideLoader())
      if (response.success) {
        dispatch(SetUser(response.data));    
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatsReponse.data));
      } else {
        dispatch(HideLoader())
        toast.error(response.message);
        navigate('/login')       
      }
    } catch (error) {
      toast.error(error.message);
      navigate('/login')
    }
  }       

  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    }
  }, [])

  return (
    <div className='h-screen w-screen bg-gray-100 p-2'> 

      {/* header */}
      <div className='flex justify-between p-5 bg-primary rounded'>
        <div className='flex item-center gap-1'>
          <i className="ri-message-3-line text-2xl"></i>
          <h1 className="text-white text-2xl uppercase font-bold">CHAT</h1>
        </div>
        <div className='flex gap-1 text-md items-center text-white'>
          <i className="ri-map-pin-user-line text-white"></i>
          <h1 className='underline text-white'>{user?.name}</h1>

          <i className="ri-logout-circle-r-line ml-5 text-xl cursor-pointer text-white"
            onClick={()=>{
              localStorage.removeItem("token");
              navigate("/login");
            }}
          ></i>
        </div>
      </div>     

      {/* content (pages)*/}
      <div className='py-5'>{children}</div>     
    </div>
  )
}

export default ProtectedRoute