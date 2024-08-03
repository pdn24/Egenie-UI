import React, { useContext, useEffect, useState } from 'react';
import '../assets/css/sidebar.css';
import EgenieLogo from '../assets/icons/EgenieLogo.svg'
import user from '../assets/image/User.svg'
import downArrow from '../assets/image/downArrow.png'
import homeIcon from '../assets/icons/homeIcon.svg'
import infoIcon from '../assets/icons/infoIcon.svg'
import { NavLink, useNavigate } from 'react-router-dom';
import productIcon from '../assets/icons/productIcon.svg'
import manuIcon from '../assets/icons/manuIcon.svg'
import bulkIcon from '../assets/icons/BulkIcon.svg'
import settingIcon from '../assets/icons/settingsIcon.svg'
import logoutIcon from '../assets/icons/logoutIcon.png'
import securityIcon from '../assets/icons/securityIcon.svg'
import bilingIcon from '../assets/icons/bilingIcon.svg'
import storeIcon from '../assets/icons/storeIcon.svg'
import templateIcon from '../assets/icons/templateIcon.svg'
import menuClose from '../assets/icons/menuClose.svg'
import EgenieBlackLogo from '../assets/icons/EgenieBlack.svg'
import menuBlack from '../assets/icons/menuBlack.svg'
import closeIconBlack from '../assets/icons/closeIcon.svg'
import sendIcon from '../assets/icons/sendIcon.svg'

// import { Cookies } from 'react-cookie';
import UserContext from '../context/userInfoContext';


export default function Sidebar() {
    const navigate = useNavigate()
    // const cookies = new Cookies();
    const { isStoreConnected, handleLogOut } = useContext(UserContext)
    const pathname = window.location.pathname
    const [subMenuVisibility, setSubMenuVisibility] = useState({
        home: false,
        product: false,
        settings: false,
        profile: false
    });
    const [sidebarVisibility, setSidebarVisibility] = useState(window.innerWidth <= 1020 ? false : true)

    const toggleSubMenu = (menu) => {
        setSubMenuVisibility(prevState => ({
            [menu]: !prevState[menu]
        }));
        if (menu === 'home') {
            navigate('/home2')
        }
    };
    const toggleSidebar = () => {
        setSidebarVisibility(!sidebarVisibility)
    }

    useEffect(() => {
        switch (pathname) {
            case "/home2":
                setSubMenuVisibility({ ...subMenuVisibility, home: true, });
                break;
            case "/store":
            case "/template":
            case "/bulkformat":
                setSubMenuVisibility({ ...subMenuVisibility, product: true, });
                break;
            case "/setting":
                setSubMenuVisibility({ ...subMenuVisibility, setting: true, });
                break;
            case "/Accountinfo":
            case "/loginsecurity":
            case "/planbilling":
                setSubMenuVisibility({ ...subMenuVisibility, profile: true, });
                break;
            default:
                setSubMenuVisibility({ ...subMenuVisibility });
        }
    }, [pathname]);

    // const handleLogOut = () => {
    //     cookies.remove("login_token");
    //     cookies.remove("user_id");
    //     localStorage.removeItem("user_info")
    //     localStorage.removeItem("active_store_id")
    //     // navigate('/')
    //     window.location.href = '/';
    // }

    return (
        <>
            <div className='block lg:hidden '>
                <div className='flex justify-between bg-black p-5 items-center'>
                    <img src={EgenieLogo} width="75px" alt='icon' onClick={() => toggleSubMenu('home')} />
                    <button onClick={toggleSidebar}>
                        {sidebarVisibility ?
                            <img src={menuClose} alt='closeicon' />
                            :
                            <img src={manuIcon} alt='menuicon' />
                        }
                    </button>
                </div>
            </div>
            {/* <div className='block lg:hidden '>
                <div className={`flex bg-black p-5 items-center relative  ${sidebarVisibility ? "justify-start" : "justify-center"}`}>
                    <div className={`absolute ${sidebarVisibility ? " right-3" : "left-3"} `}>
                        <button onClick={toggleSidebar}>
                            {sidebarVisibility ?
                                <img src={menuClose} alt='closeicon'  />
                                :
                                <img src={manuIcon} alt='menuicon' />
                            }   
                        </button>
                    </div>
                    <div className=''>
                        <img src={EgenieLogo} width="75px" alt='icon' onClick={() => toggleSubMenu('home')} />
                    </div>
                </div>
            </div> */}
            <div className={`relative  ${sidebarVisibility ? "" : "hidden"} lg:block`}>
                <aside className='sm:w-[300px] w-[250px] bg-black h-[90vh] lg:h-screen overflow-y-auto px-7 py-10 absolute lg:relative z-20'>
                    <div className='flex flex-col justify-between h-full 2xl:min-h-[650px] min-h-[500px] overflow-y-auto'>
                        <div className='flex flex-col items-center gap-10 helvetica '>
                            <div className='hidden lg:block'>
                                <img src={EgenieLogo} alt='menuicon' onClick={() => toggleSubMenu('home')} />
                            </div>
                            <div className='flex flex-col items-center gap-3 w-full '>
                                {isStoreConnected &&
                                    <>
                                        <div className={`w-full ${subMenuVisibility.home ? 'activeMainMenu ' : ''}`}>
                                            <NavLink to="/home2">
                                                <button className={`flex items-center justify-start gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800 ${subMenuVisibility.home ? 'sidebarbtnBgBlack ' : ''}`} onClick={() => toggleSubMenu('home')}>
                                                    <img src={homeIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                    <span className='text-white text-sm xl:text-lg font-normal'>Home</span>
                                                </button>
                                            </NavLink>
                                        </div>
                                        <div className='w-full '>
                                            <div className={`w-full ${subMenuVisibility.product ? 'activeMainMenu ' : ''}`}>
                                                <button className={`flex items-center justify-satrt gap-3 sm:px-4 px-2 w-full  xl:h-[60px] h-[50px] rounded-xl border border-gray-800 ${subMenuVisibility.product ? 'sidebarbtnBgBlack ' : ''}`} onClick={() => toggleSubMenu('product')}>
                                                    <div className='flex w-full justify-between items-center'>
                                                        <div className='flex items-center gap-2 '>
                                                            <img src={productIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white text-sm xl:text-lg font-normal'>Product description</span>
                                                        </div>
                                                        {subMenuVisibility.product ?
                                                            <img src={downArrow} alt='menuicon' className='rotate-180 transition-all duration-400 ease-linear' />
                                                            : <img src={downArrow} alt='menuicon' className='transition-all duration-400 ease-linear' />
                                                        }
                                                    </div>
                                                </button>
                                            </div>
                                            {subMenuVisibility.product && (
                                                <div className='flex-col animationcss'>
                                                    <NavLink to="/store" className="opacity-60">
                                                        <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-2 xl:mt-3' onClick={toggleSidebar}>
                                                            <img src={storeIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white font-normal xl:text-lg text-base'>Store</span>
                                                        </div>
                                                    </NavLink>
                                                    <NavLink to="/template" className="opacity-60">
                                                        <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                            <img src={templateIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white font-normal xl:text-lg text-base'>Template</span>
                                                        </div>
                                                    </NavLink>
                                                    <NavLink to="/bulkformat" className="opacity-60">
                                                        <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                            <img src={bulkIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white font-normal xl:text-lg text-base'>Bulk format</span>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            )}
                                        </div>
                                        <div className='w-full'>
                                            <div className={`w-full ${subMenuVisibility.settings ? 'activeMainMenu ' : ''}`}>
                                                <button className={`flex items-center justify-satrt gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800  ${subMenuVisibility.settings ? 'sidebarbtnBgBlack ' : ''}`} onClick={() => toggleSubMenu('settings')} >
                                                    <div className='flex w-full justify-between items-center'>
                                                        <div className='flex items-center gap-2'>
                                                            <img src={settingIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white text-sm xl:text-lg font-normal'>Settings</span>
                                                        </div>
                                                        {subMenuVisibility.settings ?
                                                            <img src={downArrow} alt='menuicon' className='rotate-180 transition-all duration-400 ease-linear' />
                                                            : <img src={downArrow} alt='menuicon' className='transition-all duration-400 ease-linear' />
                                                        }
                                                    </div>
                                                </button>
                                            </div>
                                            {subMenuVisibility.settings && (
                                                <div className='flex-col animationcss'>
                                                    <NavLink to="/userandpermission" className="opacity-60">
                                                        <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                            <img src={infoIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                            <span className='text-white font-normal text-sm xl:text-lg'>User & Permissions</span>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                }
                                <div className='w-full '>
                                    <div className={`w-full ${subMenuVisibility.profile ? 'activeMainMenu ' : ''}`}>
                                        <button className={`flex items-center justify-satrt gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px] rounded-xl border border-gray-800 ${subMenuVisibility.profile ? 'sidebarbtnBgBlack ' : ''}`} onClick={() => toggleSubMenu('profile')}>
                                            <div className='flex w-full justify-between items-center'>
                                                <div className='flex items-center gap-2'>
                                                    <img src={user} alt='menuicon' className='xl:w-7 w-5' />
                                                    <span className='text-white text-sm xl:text-lg font-normal'>Profile</span>
                                                </div>
                                                {subMenuVisibility.profile ?
                                                    <img src={downArrow} alt='menuicon' className='rotate-180 transition-all duration-400 ease-linear' />
                                                    : <img src={downArrow} alt='menuicon' className='transition-all duration-400 ease-linear' />
                                                }
                                            </div>
                                        </button>
                                    </div>
                                    {subMenuVisibility.profile && (
                                        <div className='flex-col animationcss'>
                                            <NavLink to="/Accountinfo" className="opacity-60">
                                                <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-2 xl:mt-3' onClick={toggleSidebar}>
                                                    <img src={infoIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                    <span className='text-white font-normal xl:text-lg text-base'>Account info</span>
                                                </div>
                                            </NavLink>
                                            <NavLink to="/loginsecurity" className="opacity-60">
                                                <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                    <img src={securityIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                    <span className='text-white font-normal xl:text-lg text-base'>Login & security</span>
                                                </div>
                                            </NavLink>
                                            <NavLink to="/planbilling" className="opacity-60">
                                                <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                    <img src={bilingIcon} alt='menuicon' className='xl:w-7 w-5' />
                                                    <span className='text-white font-normal xl:text-lg text-base'>Plan & billing</span>
                                                </div>
                                            </NavLink>
                                            {!isStoreConnected &&
                                                <NavLink to="/connectstore2" className="opacity-60">
                                                    <div className='flex items-center gap-2 sm:pl-12 pl-5 text-lg mt-1 xl:mt-3' onClick={toggleSidebar}>
                                                        <img src={sendIcon} alt='menuicon' className='arrow-rotate xl:w-5 ' />
                                                        <span className='text-white font-normal xl:text-lg text-base'>Connect to Store</span>
                                                    </div>
                                                </NavLink>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className='w-full min-h-[150px] flex items-end'>
                            <div className='logout w-full'>
                                <button className='logout-btn flex items-center justify-satrt gap-3 sm:px-4 px-2 w-full xl:h-[60px] h-[50px]' onClick={handleLogOut}>
                                    <img src={logoutIcon} alt='menuicon' className='xl:w-7 w-5' />
                                    <span className='text-white text-sm xl:text-lg font-normal'>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
