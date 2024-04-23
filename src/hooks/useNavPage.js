// 检测用户是否登录
import { useLocation, useNavigate } from "react-router-dom";
import { getUserId, getUserName } from "../utils/user-info"
import { useEffect } from "react";
import { LOGIN_PATHNAME } from "../constant";

function useNavPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const userId = getUserId()
  const userName = getUserName();
  useEffect(() => {
    if(pathname === '/') {
      navigate('/home')
    }
    if(userId &&  userName) {
      return;
    } else {
      navigate(LOGIN_PATHNAME)
    }
  }, [userName, pathname])
}

export default useNavPage;