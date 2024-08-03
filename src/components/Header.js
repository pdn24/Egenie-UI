import React from 'react';
import '../assets/css/header.css'
import '../assets/icons/EgenieLogo.svg'
import EgenieLogo from '../assets/icons/EgenieLogo.svg'
import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header className='bg-black px-4 sm:px-12 md:px-24 pt-5'>
            <div className='flex justify-between items-center border-b pb-5  border-gray-900'>
                <div className=''>
                    <img src={EgenieLogo} width="75px" alt='icon' />
                </div>
                <div className='flex gap-10 items-center helvetica'>
                    <Link to='/login'><button className='text-white'>Login</button></Link>
                    <Link to='/register'><button className='text-white signUpBtn w-[100px] sm:w-[113px] h-[44px] sm:[50px] rounded-full'>
                        <div>Sign up</div>
                    </button></Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
