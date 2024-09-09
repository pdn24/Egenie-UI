import React, { useContext, useEffect, useState } from 'react'
import '../../assets/css/BulkFormat.css'
import documentDarkIcon from '../../assets/icons/documentDarkIcon.svg'
import shoppingIcon from '../../assets/icons/shoppingIcon.svg'
import trueGreenIcon from '../../assets/icons/trueGreenIcon.svg'
import userDarkIcon from '../../assets/icons/userDarkImg.svg'
import plusWhiteIcon from '../../assets/icons/plus-white-icon.svg'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import UserContext from '../../context/userInfoContext'
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export default function Home2() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id')
    const navigate = useNavigate()
    const { isStoreConnected, userdata } = useContext(UserContext)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userdata !== null) {
            setLoading(false);
        }
    }, [userdata]);

    const handleNewStore = () => {
        navigate('/connectstore2')
    }

    const handleStoreSelect = async (shopifyStoreId) => {
        const token = cookies.get("login_token");
        if (token) {
            try {
                // Step 1: Call get_store_id API to get the store_id
                const response = await axios.post(`${apiUrl}/shopify/get_store_id`, 
                {
                    user_id: userId,
                    shopify_store_id: shopifyStoreId
                }, 
                {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    const storeId = response.data;
                    const activateResponse = await axios.post(`${apiUrl}/shopify/activate_store`, 
                    {
                        user_id: userId,
                        store_id: storeId
                    }, 
                    {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (activateResponse.status === 200) {
                        localStorage.setItem('active_store_id', storeId);
                        console.log('Store activated successfully:', activateResponse.data);
                    } else {
                        console.error('Failed to activate store:', activateResponse.data);
                    }
                } else {
                    console.error('Failed to get store ID:', response.data);
                }
            } catch (error) {
                console.error('Error during store selection process:', error);
            }
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            console.log("In Home2: Value of isStoreConnected", isStoreConnected)
            navigate('/connectstore2')
        }
    }, [isStoreConnected])

    if (loading) {
        return <div>Loading...</div>;
    }

    const storeInfo = userdata?.stores;
    console.log('In Home2.js store info', storeInfo)
    console.log('In Home2.js isStoreConnected:', isStoreConnected)

    return (
        <div className='bg-gray-100 flex flex-col h-full p-4 2xl:p-8 w-full helvetica'>
            <h2 className='xl:text-[32px] text-2xl font-bold'>Home</h2>
            <div className='w-full bg-white h-full whiteBgHeight overflow-y-auto overflow-x-hidden shadow shadow-gray p-4 xl:mt-4 mt-1 rounded-xl'>
                <div className="w-full relative">
                    <div className='flex items-center xl:mt-10 justify-center '>
                        <div className='relative' onClick={() => navigate("/home2")} style={{ cursor: "pointer" }}>
                            <div className={"opacity-100"}>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-black flex items-center justify-center'>
                                    <img src={shoppingIcon} alt='shopping icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                            </div>
                            <div className='absolute xl:-right-14 xl:-bottom-12 sm:-right-6 sm:-bottom-8 -bottom-5 -right-16'>
                                <div className='flex gap-1 items-center rounded xl:rounded-lg flex-nowrap sm:bg-black w-[150px] sm:w-auto sm:px-4 xl:px-0 sm:py-1 xl:py-0 xl:w-[180px]  xl:h-[40px] justify-center'>
                                    <span className='sm:whitespace-nowrap w-16 sm:w-auto sm:text-white xl:text-base text-xs text-center'>Link Store</span>
                                    <img src={trueGreenIcon} alt='trueGreen icon' />
                                </div>
                            </div>
                        </div>
                        <div className='relative' onClick={() => navigate("/Accountinfo")} style={{ cursor: "pointer" }}>
                            <div className={`flex items-center opacity-100`}>
                                <div className={`w-20 sm:w-24 xl:w-52 border-t-2 border-solid border-[#F0F0F0]`}></div>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-[#F0F0F0] flex items-center justify-center'>
                                    <img src={userDarkIcon} alt='user dark icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                            </div>
                            <div className='absolute xl:-right-14 xl:-bottom-12 sm:-right-10 sm:-bottom-8 -bottom-10 -right-14'>
                                <div className='flex gap-1 items-center rounded xl:rounded-lg flex-nowrap sm:bg-black w-[150px] sm:w-auto sm:px-3 xl:px-0 sm:py-1 xl:py-0 xl:w-[180px] xl:h-[40px] justify-center'>
                                    <span className='sm:whitespace-nowrap w-16 sm:w-auto sm:text-white xl:text-base text-xs text-center'>Profile Completion</span>
                                </div>
                            </div>
                        </div>
                        <div className='relative' onClick={() => navigate("/template")} style={{ cursor: "pointer" }}>
                            <div className={`flex items-center opacity-100`}>
                                <div className={`w-20 sm:w-24 xl:w-52 h-0.5 border-t-2 border-solid border-[#F0F0F0]`}></div>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-[#F0F0F0] flex items-center justify-center'>
                                    <img src={documentDarkIcon} alt='document dark icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                            </div>
                            <div className='absolute xl:-right-14 xl:-bottom-12 sm:-right-12 sm:-bottom-8 -bottom-10 -right-14'>
                                <div className='flex gap-1 items-center rounded xl:rounded-lg flex-nowrap sm:bg-black w-[150px] xl:w-[180px] sm:w-auto sm:px-3 xl:px-0 sm:py-1 xl:py-0 xl:h-[40px] justify-center'>
                                    <span className='sm:whitespace-nowrap w-16 sm:w-auto sm:text-white xl:text-base text-xs text-center'>Template Selection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-14 sm:mt-10 xl:mt-24 px-2 xl:px-8  2xl:px-36'>
                        <h2 className='xl:text-[22px] text-base my-1 xl:my-5'>Linked Stores</h2>
                        <div className="grid  grid-cols-1 gap-3 xl:gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4">
                            <div className='border rounded w-full'>
                                <div className='flex justify-between items-center w-full py-2 px-3 '>
                                    <p className='text-sm xl:text-lg'>Link a new store</p>
                                    <button className='flex items-center justify-center bg-black rounded-full xl:h-5 xl:w-5 h-[14px] w-[14px]' onClick={handleNewStore}>
                                        <img src={plusWhiteIcon} alt='icon' className='w-[10px]' />
                                    </button>
                                </div>
                            </div>
                            {storeInfo && storeInfo.map((store, index) => (
                                <div className='border rounded w-full' key={index}>
                                    <div className='flex justify-between items-center w-full py-2 px-3 '>
                                        <p className='text-sm xl:text-lg '>{store.shopify_store_name}</p>
                                        <input type="checkbox" className="xl:w-4 xl:h-4 h-3 w-3 rounded-xl focus:right-0 checked:bg-black focus:ring-0"
                                            defaultChecked={store.is_selected} 
                                            onChange={() => handleStoreSelect(store.shopify_store_id)} />
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className="grid homeCardWrap grid-cols-1 gap-5 py-5 xl:py-10 xl:gap-5 md:grid-cols-2 sm:grid-cols-2 ">
                            <div className='lg:h-[155px] h-[130px] homeBg text-lg p-5 w-full rounded-lg flex flex-col justify-between'>
                                <p className='sm:text-lg text-base'>Product Descriptions Formatted Count</p>
                                <h2 className='xl:text-[42px] text-3xl font-bold  mb-0'>
                                    {storeInfo && storeInfo.length > 0 ? storeInfo[0].total_products_formatted : 0}/50
                                </h2>
                            </div>
                            {/* <div className='lg:h-[155px] h-[130px] homeBg text-lg p-5 rounded-lg flex flex-col justify-between w-full'>
                                <p className='sm:text-lg text-base'>Linked Stores Count</p>
                                <h2 className='xl:text-[42px] text-3xl font-bold mt-5'>1/3</h2>
                            </div> */}
                            <div className='lg:h-[155px] h-[130px] homeDarkBg text-lg p-5 rounded-lg flex  justify-between w-full '>
                                <p className='text-white sm:text-lg text-base sm:whitespace-nowrap'>Upgrade Account</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

