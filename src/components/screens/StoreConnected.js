import React, { useContext, useEffect } from 'react'
import connectStoreBg from '../../assets/image/connectStorebg.png'
import connectStoreBag from '../../assets/image/connectStoreBag.png'
import dropdownToggle from '../../assets/icons/dropdownToggle.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../assets/css/BulkFormat.css'
import { Cookies } from 'react-cookie';
import UserContext from '../../context/userInfoContext'

const StoreConnected = () => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const location = useLocation()
    const IsAfterConecting = location.state?.IsAfterConecting
    const userId = cookies.get('user_id')
    const { isStoreConnected, fetchUserInfo } = useContext(UserContext)

    const handleContinue = () => {
        navigate('/home2')
    }
    useEffect(() => {
        const token = cookies.get("login_token")
        console.log('isStoreConnected: condition ', isStoreConnected)
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        } else if (!IsAfterConecting) {
            navigate('/home2')
        } else {
            fetchUserInfo(userId)
        }
    }, [])
    return (
        <div className='bg-gray-100 h-full flex flex-col p-4 2xl:p-8 w-full helvetica'>
            <h2 className='xl:text-3xl text-2xl font-bold'>Connect Store</h2>
            <div className='h-full bg-white shadow shadow-gray whiteBgHeight overflow-x-hidden overflow-y-auto flex justify-center xl:mt-4 mt-1 rounded-xl my-2'>
                <div className='flex flex-col items-center justify-center xl:gap-8 gap-4 max-w-[562px] author'>
                    <div className='relative mb-28 xl:mb-32'>
                        <img src={connectStoreBg} alt='connect store bg' className='sm:max-w-[450px] max-w-[300px] xl:max-w-[570px]' />
                        <img src={connectStoreBag} className='absolute top-0 sm:max-w-[450px] max-w-[300px] xl:max-w-[570px]' alt='connect store bag' />
                    </div>
                    <h4 className='text-2xl font-semibold text-center xl:mt-10 text-black'>Your Shopify store has been connected </h4>
                    <button className='max-w-[200px] xl:max-w-[300px] bg-black text-white xl:py-2 py-1 mb-2 rounded-3xl w-full text-base xl:text-lg helvetica' onClick={handleContinue}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default StoreConnected;
