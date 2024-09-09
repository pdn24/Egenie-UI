// AcceptConnection.js
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import UserContext from '../../context/userInfoContext';

const AcceptConnection = () => {
  const { fetchUserInfo } = useContext(UserContext);
  const cookies = new Cookies();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get("storeId") || null;
  const storeName = queryParams.get("storeName") || null;
  const userId = queryParams.get("userId") || null;
  const token = queryParams.get("token") || null;
  const page = queryParams.get("page") || null;

  useEffect(() => {
    const handleConnection = async () => {
      const existingToken = localStorage.getItem("token");
      const existingUserId = localStorage.getItem("user_id");

      console.log('AcceptConnection - existingToken:', existingToken);
      console.log('AcceptConnection - existingUserId:', existingUserId);
      console.log('AcceptConnection - storeId:', storeId);
      console.log('AcceptConnection - storeName:', storeName);
      console.log('AcceptConnection - userId:', userId);
      console.log('AcceptConnection - token:', token);
      console.log('AcceptConnection - page:', page);

      if (token && userId) {    
        cookies.set('login_token', token);
        cookies.set('user_id', userId);
        localStorage.setItem("user_info", JSON.stringify({ id: userId }));

        if (page === "googlelogin") {
          console.log('AcceptConnection - Inside if condition for googlelogin');
          console.log('AcceptConnection - storeId:', storeId);
          console.log('AcceptConnection - storeName:', storeName);

          if (storeId && storeName) {
            // Await the fetchUserInfo call
            await fetchUserInfo(userId);
            console.log("Came back to AcceptConnection from UserProvider. Navigating to /home2");
            navigate("/home2");
          } else {
            navigate("/connectstore2", { state: { isConnectNewStore: true } });
          }
        } else if (page === "shopifyconnect" && storeId && storeName) {
          navigate("/home2");
        } else if (page === "reset") {
          navigate(`/user/reset_password/${token || existingToken}`);
        }
      } else {
        navigate("/login");
      } 
    };

    handleConnection();
  }, [cookies, fetchUserInfo, navigate, page, storeId, storeName, token, userId]);

  return <div>Loading...</div>; // No HTML to return
};    

export default AcceptConnection;
