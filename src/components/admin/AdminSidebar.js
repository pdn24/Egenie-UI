import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import EgenieLogo from '../../assets/icons/EgenieLogo.svg';
import homeIcon from '../../assets/icons/homeIcon.svg';
import templateIcon from '../../assets/icons/templateIcon.svg';
import infoIcon from '../../assets/icons/infoIcon.svg';
import logoutIcon from '../../assets/icons/logoutIcon.png';
import UserContext from '../../context/userInfoContext';
import { Cookies } from 'react-cookie';


function AdminSidebar() {   
    const cookies = new Cookies();
    const { handleLogOut } = useContext(UserContext);
    const token = cookies.get("login_token")

    const handleLogoutAndNavigate = () => {       
        handleLogOut();
    };

    if (!token) {
        return null;
    }
    return (
        <aside className='sm:w-[300px] w-[250px] bg-black h-[90vh] lg:h-screen overflow-y-auto px-7 py-10'>
            <div className='flex flex-col justify-between h-full 2xl:min-h-[650px] min-h-[500px] overflow-y-auto'>
                <div className='flex flex-col items-center gap-10 helvetica'>
                    <div className='hidden lg:block'>
                        <img src={EgenieLogo} alt='Egenie Logo' className='sidebar-logo' />
                    </div>
                    <div className='flex flex-col items-center gap-3 w-full'>
                        <div className='w-full'>
                            <NavLink to="/admin/dashboard" className='flex items-center justify-start gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800'>
                                <img src={homeIcon} alt='Dashboard' className='xl:w-7 w-5' />
                                <span className='text-white text-sm xl:text-lg font-normal'>Dashboard</span>
                            </NavLink>
                        </div>
                        <div className='w-full'>
                            <NavLink to="/admin/template" className='flex items-center justify-start gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800'>
                                <img src={templateIcon} alt='Template' className='xl:w-7 w-5' />
                                <span className='text-white text-sm xl:text-lg font-normal'>Template</span>
                            </NavLink>
                        </div>
                        <div className='w-full'>
                            <NavLink to="/admin/account-info" className='flex items-center justify-start gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800'>
                                <img src={infoIcon} alt='Account Info' className='xl:w-7 w-5' />
                                <span className='text-white text-sm xl:text-lg font-normal'>Account Info</span>
                            </NavLink>
                        </div>
                        <div className='w-full'>
                            <button onClick={handleLogoutAndNavigate} className='flex items-center justify-start gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800'>
                                <img src={logoutIcon} alt='Logout' className='xl:w-7 w-5' />
                                <span className='text-white text-sm xl:text-lg font-normal'>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar; 