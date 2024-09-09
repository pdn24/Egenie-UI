import { useEffect, useState } from "react";
import Usercontext from "./userInfoContext";
import axios from "axios";
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

export const UserProvider = ({ children }) => {
    const cookies = new Cookies();
    const [userdata, setUserdata] = useState()
    const [isStoreConnected, setIsStoreConnected] = useState(false)
    const [loading, setLoading] = useState(true);
    const userId = cookies.get('user_id')
    const token = cookies.get("login_token")
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchUserInfo = async (id) => {
        console.log('In fetchUserInfo userid: ', id)
        const data = {
            user_id: id
        }
        try {
            const response = await axios.post(`${apiUrl}/user/get_user_info`, data, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log("In fetchUserInfo:after call to user/get_user_info : ", response)
            setUserdata(response.data)
            console.log('In fetchuserinfo: setIsStoreConnected', response.data.stores?.length !== 0)
            setIsStoreConnected(response.data.stores?.length !== 0);
            console.log('Value of setIsStoreConnected:', response.data.stores?.length !== 0);
            const activeStore = response.data?.stores.find((store) => store.is_selected === true)
            console.log("fetchUserInfo:", activeStore?.id )
            localStorage.setItem("active_store_id", activeStore?.id)
        } catch (err) {
            console.log('err: ', err)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (token) {
            fetchUserInfo(userId)
        } else {
            setLoading(false);
        }
    }, [userId, token])

    const handleLogOut = async () => {
        cookies.remove("login_token", { path: '/' });
        cookies.remove("user_id", { path: '/' });
        console.log("cookies cleared");
        localStorage.removeItem("user_info")
        localStorage.removeItem("active_store_id")
        // navigate('/login', { replace: true });
        window.location.href = '/';
    }

    return (
        <Usercontext.Provider value={{ userdata, isStoreConnected, fetchUserInfo, handleLogOut }}>
            {!loading && children}
        </Usercontext.Provider>
    )
}

