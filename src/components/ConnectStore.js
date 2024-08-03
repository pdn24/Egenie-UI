import React from 'react';
import storeLinkIocn from '../assets/icons/storeLinkIcon.svg'
import "../assets/css/signup.css"
import EgenieLogo from '../assets/icons/EgenieLogo.svg'
import { useNavigate, useParams } from 'react-router-dom';


const ConnectStore = () => {
    const { token } = useParams();
    return (
        <div className='loginPageBg h-screen overflow-y-auto'>
            <div className='py-9 px-6 md:px-28 w-full '>
                <img src={EgenieLogo} width='80px' alt='Egenie logo' />
                <div className='border-b border-gray-800 pt-8'></div>
                <div className='flex justify-center items-center h-[70vh] mt-5 sm:mt-20'>
                    <div className='loginPageCard h-[300px] sm:h-[360px]'>
                        <h2 className='text-white text-center text-[26px] sm:text-4xl mt-8 author'>Connect your Shopify store</h2>
                        <form className='flex items-center flex-col px-5 sm:px-16 mt-7 sm:mt-10 sm:gap-6 gap-4 helvetica'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label className='text-white'>Store Link</label>
                                <div className='relative'>
                                    <span className='absolute storeLink'><img src={storeLinkIocn} alt='user-icon' /></span>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder='Shopify store link paste here'
                                        autoComplete="email"
                                        className="h-[40px] sm:h-[50px] w-full pl-12 sm:pl-14 bg-transparent inputBorder rounded-full  text-white placeholder:text-gray-400 text-sm sm:text-md sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className='w-full mt-4'>
                                <button className='w-full h-[40px] sm:h-[50px] rounded-3xl text-center bg-white text-black text-base sm:text-lg font-bold'>Connect</button>
                            </div>
                            <a className='text-gray-300 underline '>Skip</a>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ConnectStore;
