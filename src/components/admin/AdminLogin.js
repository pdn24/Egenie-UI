import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EgenieLogo from '../../assets/icons/EgenieLogo.svg';
import sendIcon from '../../assets/icons/sendIcon.svg';
import closeIcon from '../../assets/icons/closeIconWhite.svg';
import { Cookies } from 'react-cookie';
import "../../assets/css/signup.css";
import "../../assets/css/loader.css";

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();
    const apiUrl = process.env.REACT_APP_API_URL;


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/auth`, {
                username,
                password,
                login_type: 'login'
            });
            console.log('Admin Login. Login response:', response.data);
            const user = response.data.user[0];            
            cookies.set('user_id', user.id);
            if (user.role === 'Superuser') {
                cookies.set('login_token', response.data.access_token);
                cookies.set('user_role', 'admin');
                navigate('/admin/dashboard');
            } else {
                alert('Unauthorized');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    return (
        <div className='loginPageBg h-screen overflow-y-auto pt-2 xl:pt-5 px-6 md:px-28 flex flex-col'>
            <div className='flex justify-center mt-3 sm:mt-0 sm:justify-between items-center relative'>
                <img src={EgenieLogo} width='80px' alt="icons" />
                <button className='hidden sm:block text-white signUpBtn w-[170px] xl:w-[185px] h-[44px] rounded-full' onClick={() => navigate('/')}>
                    <div className='flex justify-center gap-2 items-center'>
                        <img src={sendIcon} className='arrow-rotate w-3' alt='sendicon' />
                        <span>Go to home</span>
                    </div>
                </button>
                <button className='text-white signUpBtn w-[43px] absolute sm:relative h-[43px] rounded-full sm:hidden right-0' onClick={() => navigate('/')}>
                    <div>
                        <img src={closeIcon} className='closeIcon' alt='closeitem' />
                    </div>
                </button>
            </div>
            <div className='lg:border-b border-gray-800 xl:pt-8 pt-2'></div>
            <div className='flex justify-center items-center h-full my-4'>
                <div className='loginPageCard xl:max-w-[520px] max-w-[400px] h-full flex items-center max-h-[600px] shadow-gray-800 shadow-sm'>
                    <div className='w-full'>
                        <h2 className='text-white text-center text-[26px] sm:text-3xl xl:text-4xl xl:mt-8 mt-2 author'>Admin Login</h2>
                        <form className='flex items-center flex-col px-5 sm:px-10 xl:px-16 xl:mt-10 mt-3 gap-6 helvetica' onSubmit={handleLogin}>
                            <div className='flex flex-col gap-2 w-full'>
                                <label className='text-gray-300 label-font xl:text-base text-sm'>Username</label>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="h-[44px] xl:h-[50px] w-full pl-14 bg-transparent inputBorder rounded-full googleLoginBtn text-white placeholder:text-gray-400 xl:text-md sm:leading-6 focus:border-none focus:ring-white"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label className='text-gray-300 label-font'>Password</label>
                                <div className='relative'>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-[44px] xl:h-[50px] w-full pl-14 bg-transparent googleLoginBtn inputBorder rounded-full text-white placeholder:text-gray-400 xl:text-md sm:leading-6 focus:border-none focus:ring-white"
                                    />
                                </div>
                            </div>
                            <div className='w-full xl:mt-5 mt-2'>
                                <button className='w-full h-[42px] xl:h-[50px] rounded-3xl text-center bg-white text-black text-base xl:text-lg font-bold'>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin; 