import React, { useContext, useEffect, useState } from 'react'
import connectStore from '../../assets/image/connectStore.png'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import axios from 'axios';
import UserContext from '../../context/userInfoContext';
import { useLocation } from 'react-router-dom';

export default function ConnectStore2() {


    const navigate = useNavigate()
    const cookies = new Cookies();
    const location = useLocation()
    const isConnectNewStore = location.state?.isConnectNewStore
    const { isStoreConnected } = useContext(UserContext)
    const { fetchUserInfo } = useContext(UserContext)
    const [storeUrl, setStoreUrl] = useState('')
    const [error, setError] = useState('')
    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = cookies.get('user_id')

    const handleConnectStore = async () => {
        if (!storeUrl) {
            setError('Please enter a store URL')
            return;
        }
        try {
            const data = {
                shopify_store_url: storeUrl,
                user_id: userId,
            }
            const response = await axios.post(`${apiUrl}/shopify/connect`, data, {
                headers: { 'Content-Type': 'application/json' }
            })
            await fetchUserInfo(userId)
            const shopifyUrl = response.data.oauth_url
            navigate("/storeconnected", { state: { IsAfterConecting: true } })
            window.open(shopifyUrl)
            // navigate('/storeconnected')
        } catch (err) {
            console.log('err: ', err)
        }

    }
    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (isConnectNewStore && isStoreConnected) {
            navigate('/home2')
        }
    }, [isStoreConnected])
    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold'>Connect Store</h2>
            <div className='w-full h-full whiteBgHeight overflow-y-auto bg-white shadow shadow-gray flex justify-center xl:mt-4 mt-1 px-4 pb-8 rounded-xl'>
                <div>
                    <div className='flex flex-col items-center xl:gap-8 gap-4 author xl:pt-12 pt-3  '>
                        <img src={connectStore} alt='connect store' className='xl:max-w-[520px] max-w-[400px] w-full ' />
                        <h4 className='text-xl xl:text-2xl font-semibold max-w-[400px] text-center text-black'>Lets get started! Connect your Shopify store and let the magic begin</h4>
                        <div className='flex flex-col max-w-[400px] w-full gap-1 relative'>
                            <label className='text-black xl:text-lg text-base'>Store URL</label>
                            <input type='text' placeholder='Eg. STORENAME.myshopify.com'
                                className='text-base xl:text-lg border xl:py-2 py-1 px-4 rounded-lg focus:ring-black focus:border-transparent border-gray-300'
                                value={storeUrl}
                                onChange={(e) => { setStoreUrl(e.target.value); setError('') }}
                            />
                            {error && (
                                <p className="text-red-500 text-md ms-3 absolute -bottom-5">{error}</p>
                            )}
                        </div>
                    </div>
                    <div className='flex justify-center 2xl:mt-4 mt-1'>
                        <button className='max-w-[200px] xl:max-w-[300px] bg-black text-white xl:py-2 py-1 my-4 rounded-3xl w-full xl:text-lg text-base helvetica' onClick={handleConnectStore}>Connect Store</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
