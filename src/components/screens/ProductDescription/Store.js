import React, { useContext, useEffect, useState } from 'react'
import editIcon from '../../../assets/icons/Pen2.svg'
// import trashIcon from '../../../assets/icons/trash-bin-icon.svg'
import storeIcon from '../../../assets/icons/storeIcon.svg'
// import phone_calling from '../../../assets/icons/phone-calling-icon.svg'
import link_url from '../../../assets/icons/link-url.svg'
import Deactivate from '../../../assets/icons/deactivate-3.svg'
// import latterIcon from '../../../assets/icons/letter-icon.svg'
import plusIcon from '../../../assets/icons/plus-white-icon.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import { Tooltip } from "flowbite-react"
import { Cookies } from 'react-cookie';
import UserContext from '../../../context/userInfoContext'
import axios from 'axios'
import { showAlert } from '../../utils/AlertService'

function Store() {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { isStoreConnected, fetchUserInfo, userdata } = useContext(UserContext)
    const storeInfo = userdata?.stores

    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = cookies.get('user_id')

    const handleStoreDeactivation = async (id) => {
        const data = {
            user_id: userId,
            store_id: id
        }
        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/shopify/deactivate_store`, data, {
                headers: { 'Content-Type': 'application/json', },
            })
            fetchUserInfo(userId)
            showAlert(response.data.message || "Store successfully deactivated", "success")
        } catch (error) {
            console.log(" error", error);
        } finally {
            setLoading(false);
        }
    }
    const handleStoreActivation = async (id) => {
        const data = {
            user_id: userId,
            store_id: id
        }
        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/shopify/activate_store`, data, {
                headers: { 'Content-Type': 'application/json', },
            })
            console.log('response: ', response)
            fetchUserInfo(userId)
            showAlert(response.data.message || "Store successfully activated", "success")
        } catch (error) {
            console.log(" error", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        }
    }, [])
    return (
        <div className='bg-gray-100 h-full 2xl:p-8 p-4 w-full helvetica flex flex-col'>
            <div className='flex justify-between items-center mb-2'>
                <h2 className='xl:text-[32px] text-2xl font-bold'>Store</h2>
                <NavLink to={{ pathname: '/connectstore2' }}>
                    <button className='bg-black flex items-center justify-center gap-3 rounded-[50px] w-[140px] xl:w-[200px] xl:h-[50px] lg:h-[45px] h-[36px]'>
                        <img src={plusIcon} alt='plusIcon' />
                        <span className='text-white text-sm lg:text-base lg:font-bold'>Add store</span>
                    </button>
                </NavLink>
            </div>
            {storeInfo?.length > 0 &&
                storeInfo.map((store, i) => (
                    <div className='w-full h-full whiteBgHeight bg-white shadow shadow-gray xl:mt-4 mt-1 px-3 md:px-12 py-8 rounded-xl' key={i}>
                        <div className='flex justify-between items-center w-full'>
                            <h2 className='text-2xl font-bold'>Profile</h2>
                            <div className='flex items-center gap-2'>
                                {/* <img src={editIcon} className='w-[30px]' alt='editIcon' /> */}
                                {/* <img src={editIcon} alt='trashIcon' className='cursor-pointer' /> */}
                                <Tooltip content="Deactivate" placement="bottom"><button className='cursor-pointer'
                                    onClick={() => handleStoreDeactivation(store.id)}><img src={editIcon} alt='trashIcon' /></button></Tooltip>

                            </div>
                        </div>
                        <div className='border w-full rounded-xl flex gap-4 flex-col mt-6 pt-5'>
                            <div className='border-b pb-4 sm:px-5 px-3'>
                                <div className='flex gap-3 items-center'>
                                    <div className='bg-gray-100 xl:p-3 p-2 rounded'>
                                        <img src={storeIcon} className='filter-image-dark xl:w-[38px] sm:w-[30px] w-[25px]' alt='storeIcon' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-bold xl:text-xl sm:text-base text-sm'>Store name</p>
                                        <span className='xl:text-xl sm:text-base text-sm text-gray-400'>{store.shopify_store_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='border-b pb-4 sm:px-5 px-3'>
                                <div className='flex gap-3 items-center'>
                                    <div className='bg-gray-100 p-2 xl:p-3 rounded'>
                                        <img src={link_url} className='filter-image-dark xl:w-[38px] sm:w-[30px] w-[25px]' alt='phone_calling' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-bold xl:text-xl sm:text-base text-sm'>Store url</p>
                                        <span className='xl:text-xl sm:text-base text-sm text-gray-400'>{store.shopify_store_url}</span>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='pb-4 sm:px-5 px-3'>
                                <div className='flex gap-3 items-center'>
                                    <div className='bg-gray-100 p-2 xl:p-3 rounded'>
                                        <img src={latterIcon} className='filter-image-dark xl:w-[38px] sm:w-[30px] w-[25px]' alt='latterIcon' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-bold xl:text-xl sm:text-base text-sm'>Store email</p>
                                        <span className='xl:text-xl sm:text-base text-sm text-gray-400'>shop@poshpelle.com</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default Store
