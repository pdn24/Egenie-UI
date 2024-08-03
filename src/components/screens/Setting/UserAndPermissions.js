import React, { useContext, useEffect, useState } from 'react'
import pooja from '../../../assets/image/pooja.png'
import paypalIcon from '../../../assets/icons/paypal.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import UserContext from '../../../context/userInfoContext';
import axios from 'axios';

export default function UserAndPermissions() {

    const cookies = new Cookies();
    const navigate = useNavigate()
    const { isStoreConnected, userdata } = useContext(UserContext)
    const location = useLocation();
    const { staffData } = location.state || {};
    const [AllStaff, setAllStaff] = useState(staffData || {});
    // const [AllStaff, setAllStaff] = useState([
    //     {
    //         profile_img: pooja,
    //         first_name: "Pooja",
    //         last_name: "Kshatriya",
    //     }
    // ])

    const [subscriptionPlans, setSubscriptionPlans] = useState([])

    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = cookies.get('user_id')

    const fetchAllStaff = async () => {
        try {
            const response = await axios.get(`${apiUrl}/user/get_all_users_by_store/${userId}`, {
                headers: { 'Content-Type': 'application/json', },   
            })
            console.log("response>>>", response.data)
            setAllStaff(response.data)
            // setLoading(true);
        } catch (error) {
            // setLoading(false);
            console.log(error);
        }
        
    };
    
   
    // useEffect(() => {
    //     setAllStaff([...AllStaff, AllStaff.push(staffData)])
    //     setAllStaff((prevAllStaff) => [...prevAllStaff, staffData]);
    // }, [])

    const handleAddStaff = () => {
        navigate('/addstaff')
    }

    useEffect(() => {
        fetchAllStaff()
    }, [])

    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        }
    }, [])
    return (
        <div className='bg-gray-100 h-full xl:p-8 p-4 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-xl sm:text-2xl font-bold'>Users & permissions </h2>
            <div className='w-full h-full whiteBgHeight overflow-y-auto bg-white shadow shadow-gray xl:mt-4 mt-2 px-3 sm:px-6 xl:px-16 py-3 xl:py-9 rounded-xl'>
                <h4 className='sm:text-xl text-lg font-bold'>Permissions</h4>
                <p className='mt-1 text-gray-400 xl:text-xl sm:text-lg  text-sm'>Manage what users can see or do in your store.</p>
                <div className='bg-white shadow mt-2 sm:mt-7 rounded-lg'>
                    <div className='flex justify-between items-center border-b xl:px-5 px-2 py-3'>
                        <h3 className='font-bold md:text-xl text-base'>Store owner</h3>
                        {/* <p className='underline cursor-pointer xl:text-xl lg:text-lg text-sm'>Transfer ownership</p> */}
                    </div>
                    <div className='py-3 px-5'>
                        <div className='flex gap-3 items-center'>
                            <div className='bg-[#E1F1F9] p-2 xl:p-3 rounded'>
                                <img src={paypalIcon} className=' xl:w-[30px] sm:max-w-[25px] max-w-[20px]' alt='paypal' />
                            </div>
                            <div className='flex flex-col'>
                                <p className='xl:text-xl lg:text-base text-xs'>{userdata.name}</p>
                                {/* <span className='xl:text-xl lg:text-sm text-xs text-gray-400'>Last login was Thursday, 15 February,  2024 10:19 am IST</span> */}
                            </div>
                        </div>
                        {/* <p className='mt-3 xl:text-xl lg:text-sm text-xs'>Note : Some owner permissions can’t be assigned to staff </p> */}
                    </div>
                </div>
                <div className='bg-white shadow mt-2 sm:mt-5 pb-3 rounded-lg'>
                    <div className='flex justify-between items-center border-b xl:px-5 px-2 py-3'>
                        <h3 className='font-bold md:text-xl text-base'>Staff (1 of 2)</h3>
                        <p className='underline cursor-pointer xl:text-xl lg:text-lg text-sm' onClick={handleAddStaff}>Add staff</p>
                    </div>

                    <div className='overflow-y-auto max-h-[120px]  2xl:max-h-[280px] h-full'>
                        {AllStaff?.users?.length > 0 &&
                            AllStaff?.users?.map((profile, i) => (
                                <div className='py-3 px-5' key={i}>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-3 items-center'>
                                            {/* <img src={profile?.profile_img} className=' xl:w-[54px] sm:max-w-[40px] max-w-[30px]' alt='profile' /> */}
                                            <div className='flex flex-col'>
                                                <p className='xl:text-xl lg:text-base text-xs'>{profile?.name} </p>
                                                <span className='xl:text-xl lg:text-sm text-xs text-gray-400'>Invitation sent</span>
                                            </div>
                                        </div>
                                        <p className='xl:text-xl lg:text-sm text-xs text-gray-400'>Limited permissions</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {/* <p className='underline cursor-pointer xl:text-xl lg:text-sm text-xs py-2 px-5'>Show 1 suspended staff</p> */}
                </div>


            </div>
        </div>
    )
}
