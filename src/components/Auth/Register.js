import React, { Fragment, useContext, useEffect, useState } from 'react';
import email from '../../assets/image/Letter.svg'
import usericon from '../../assets/image/User.svg'
import password from '../../assets/image/LockPassword.svg'
import "../../assets/css/signup.css"
import EgenieLogo from '../../assets/icons/EgenieLogo.svg'
import googleIcon from '../../assets/image/google.svg'
import facebookIcon from '../../assets/image/facebook.svg'
import { NavLink, useNavigate } from 'react-router-dom';
import sendIcon from '../../assets/icons/sendIcon.svg'
import closeIcon from '../../assets/icons/closeIconWhite.svg'
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { PhoneIcon } from "@heroicons/react/24/outline";
import { showAlert } from '../utils/AlertService';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import UserContext from '../../context/userInfoContext'

const Register = () => {

    const cookies = new Cookies();
    const navigate = useNavigate()

    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const { fetchUserInfo } = useContext(UserContext)

    // const [countryCodeList, setCountryCodeList] = useState()
    // const [selectedCode, setSelectedCode] = useState({
    //     country_id: 1,
    //     id: 1,
    //     phone_code: "+61"
    // })

    const [formValue, setFormValue] = useState({
        login_type: "signup",
        name: "",
        email: "",
        password: "",
        // country_code: selectedCode.code,
        // phone_number: ""
    });

    // const getCountryCodes = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}/user/get_phone_country_codes`, {
    //             headers: { 'Content-Type': 'application/json' },
    //         })
    //         setCountryCodeList(response.data.sort((a, b) => a.phone_code - b.phone_code))
    //     } catch (err) {
    //         console.log('err: ', err)
    //     }
    // }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        // phone_number: "",
        form: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };
        if (!formValue.name) {
            newErrors.name = "Name is required.";
            formIsValid = false;
        } else {
            newErrors.name = "";
        }
        if (!formValue.email) {
            newErrors.email = "Email is required.";
            formIsValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValue.email)) {
            newErrors.email = 'Please enter a valid email address'
            formIsValid = false
        }
        else {
            newErrors.email = "";
        }
        if (!formValue.password) {
            newErrors.password = "Password is required.";
            formIsValid = false;
        }
        else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(formValue.password)) {
            newErrors.password = 'Please enter a valid password'
            formIsValid = false
        }
        else {
            newErrors.password = "";
        }

        // if (!formValue.phone_number) {
        //     newErrors.phone_number = "Phone Number is required.";
        //     formIsValid = false;
        // } else if (formValue.phone_number.length < 10) {
        //     newErrors.phone_number = 'Phon no must be 10 digit'
        //     formIsValid = false
        // } else {
        //     newErrors.phone_number = "";
        // }

        if (!formIsValid) {
            setErrors(newErrors);
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${apiUrl}/auth`, formValue, {
                headers: { 'Content-Type': 'application/json' },
            })
            showAlert(response.data.message || "User Registered Successfully", "success")
            setErrors({ name: "", email: "", password: "", phone_number: "", form: "" });
            setFormValue({ name: "", email: "", password: "", country_code: "", phone_number: "" });
            setIsLoading(false);
            navigate("/login");

        } catch (error) {
            setIsLoading(false);
            setErrors({ form: error.response.data || "Something went wrong" });
            console.log(error);
        }
    };

    // const cc_format = (value) => {
    //     const v = value.replace(/[^0-9]/gi, "").substr(0, 10);
    //     const formatted = v.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    //     return formatted;
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        // if (name === "phone_number") {
        //     setFormValue({ ...formValue, [name]: cc_format(value) });
        // }
        setErrors({ ...errors, [name]: "" });
    };

    const handleGoToHome = () => {
        navigate('/')
    }

    const login = async (email) =>{
        try{
            const data={
                username: email,
                password: '',
                login_type: 'login'
            }
            const response = await axios.post(`${apiUrl}/auth`, data, {
                headers: { 'Content-Type': 'application/json', },
            })
            const login_token = response.data?.access_token
            cookies.set('login_token', login_token);
            cookies.set('user_id', response.data?.user?.id);
            localStorage.setItem("user_info", JSON.stringify(response.data?.user))
            const activeStore = response.data?.user?.stores.find((store) => store.is_selected === true)
            localStorage.setItem("active_store_id", activeStore?.id)
            setFormValue({ username: "", password: "" });
            setErrors({ username: "", password: "", form: "" });
            fetchUserInfo(response.data?.user?.id)
            navigate("/connectstore2", { state: { isConnectNewStore: true } });
         }catch(err) {
            console.log("login error:- ",err);
        }
    }
    
    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse)
            if (user) {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                }).then(async (res) => {
                        try {
                            const signUp = {
                                login_type: "signup",
                                name: res?.data?.name,
                                email: res?.data?.email,
                                password: ""
                            }

                            const response = await axios.post(`${apiUrl}/auth`, signUp, {
                                headers: { 'Content-Type': 'application/json' },
                            })

                            login(res?.data?.email)
                        } catch (error) {
                            login(res?.data?.email)
                        }
                    })
                    .catch((err) => console.log("Error:", err));
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const token = cookies.get("login_token")
        if (token) {
            navigate('/home2')
        } 
        // else {
        //     getCountryCodes()
        // }
    }, [])

    return (
        <div>
            <div className='loginPageBg h-screen overflow-y-auto pt-2 xl:pt-5 px-6 md:px-28 flex flex-col'>
                <div className='flex justify-center mt-3 sm:mt-0 sm:justify-between relative items-center'>
                    <img src={EgenieLogo} width='80px' alt="icons" />
                    <button className='hidden sm:block text-white signUpBtn w-[170px] xl:w-[185px] h-[44px] sm:[50px] rounded-full' onClick={handleGoToHome}>
                        <div className='flex justify-center gap-2 items-center'>
                            <img src={sendIcon} className='arrow-rotate w-3' alt='' />
                            <span>Go to home</span>
                        </div>
                    </button>
                    <button className='text-white signUpBtn w-[43px]  h-[43px] rounded-full sm:hidden absolute sm:relative right-0' onClick={handleGoToHome}>
                        <div>
                            <img src={closeIcon} className='closeIcon' alt='' />
                        </div>
                    </button>

                </div>
                <div className='lg:border-b border-gray-800 xl:pt-8 pt-2'></div>
                <div className='flex justify-center h-full items-center my-4'>
                    <div className='loginPageCard xl:h-[800px]'>
                        {isLoading &&
                            <div className='flex items-center justify-center'>
                                <div className="spinner"></div>
                            </div>
                        }
                        <h2 className='text-white text-center text-[26px] text-3xl xl:text-4xl xl:mt-8 mt-2 author'>Sign up to your account</h2>
                        <form className='flex items-center flex-col px-5 sm:px-16 my-4 xl:mt-10 gap-5 xl:gap-6 helvetica' onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-1 xl:gap-2 w-full'>
                                <label className='text-gray-300 text-xs xl:text-base'>Full Name</label>
                                <div className='relative'>
                                    <span className='absolute align-user '><img src={usericon} alt='user-icon' /></span>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder='Enter full name'
                                        autoComplete="email"
                                        className="h-[40px] xl:h-[50px] w-full pl-14 bg-transparent googleLoginBtn inputBorder rounded-full  text-white placeholder:text-gray-400 xl:text-md text-sm sm:leading-6 focus:border-none focus:ring-white"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs ms-5 absolute -bottom-5">{errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 xl:gap-2 w-full'>
                                <label className='text-gray-300 text-xs xl:text-base'>Email</label>
                                <div className='relative'>
                                    <span className='absolute align-user'><img src={email} alt='user-icon' /></span>
                                    <input
                                        id="name"
                                        name="email"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder='Enter your email'
                                        autoComplete="email"
                                        className="h-[40px] xl:h-[50px] w-full pl-14 bg-transparent googleLoginBtn inputBorder rounded-full  text-white placeholder:text-gray-400 xl:text-md sm:leading-6 text-sm focus:border-none focus:ring-white"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs ms-5  absolute -bottom-5">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 xl:gap-2 w-full'>
                                <label className='text-gray-300 text-xs xl:text-base'>Password</label>
                                <div className='relative'>
                                    <span className='absolute align-user'><img src={password} alt='user-icon' /></span>
                                    <input
                                        id="name"
                                        name="password"
                                        type="password"
                                        onChange={handleChange}
                                        placeholder='Enter your Password'
                                        autoComplete="email"
                                        className="h-[40px] xl:h-[50px] w-full pl-14 bg-transparent inputBorder googleLoginBtn rounded-full  text-white  placeholder:text-gray-400 xl:text-md text-sm sm:leading-6 focus:border-none focus:ring-white"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs ms-5 absolute -bottom-5">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            {/* <div className='flex flex-col gap-1 xl:gap-2 w-full'>
                                <label className='text-gray-300 text-xs xl:text-base'>Phone Number</label>
                                <div className='relative w-full'>
                                    <span className='absolute align-user'><PhoneIcon className="h-5 w-5 text-white" aria-hidden="true" /></span>
                                    <input
                                        type="text"
                                        name='phone_number'
                                        placeholder='Enter phon no.'
                                        className={`h-[40px] xl:h-[50px] w-full pl-32 bg-transparent googleLoginBtn inputBorder rounded-full  text-white placeholder:text-gray-400 xl:text-md sm:leading-6 text-sm focus:border-none focus:ring-white`}
                                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }}
                                        maxLength={10}
                                        value={formValue.phone_number}
                                        onChange={handleChange} />

                                    <Listbox value={selectedCode} onChange={setSelectedCode}>
                                        {({ open }) => (
                                            <div className='absolute left-12 xl:bottom-3 bottom-2' >
                                                <div className="relative">
                                                    <Listbox.Button className="relative">
                                                        <div className="flex items-center">
                                                            <span className="block text-[#939393]">
                                                                {selectedCode?.phone_code}
                                                            </span>
                                                        </div>
                                                        <span className="absolute flex items-center left-12 top-0">
                                                            <ChevronDownIcon className="h-5 w-5 text-[#939393]" aria-hidden="true" />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-[70px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg poin">
                                                            {countryCodeList &&
                                                                countryCodeList.map((code, i) => (
                                                                    <Listbox.Option
                                                                        key={i}
                                                                        className={({ active }) =>
                                                                            classNames(
                                                                                active ? 'bg-gray-100 text-black' : 'text-gray-400',
                                                                                'relative cursor-default select-none py-2 pl-3 pr-2'
                                                                            )
                                                                        }
                                                                        value={code}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <span
                                                                                className='font-normal block cursor-pointer'
                                                                            >
                                                                                {code.phone_code}
                                                                            </span>

                                                                        </div>
                                                                    </Listbox.Option>
                                                                ))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </div>
                                        )}
                                    </Listbox>
                                    {errors.phone_number &&
                                        <p className='text-red-500 text-xs ms-5 absolute -bottom-5'>{errors.phone_number}</p>
                                    }
                                    {errors.form &&
                                        <p className="text-red-500 text-xs ms-5 absolute -bottom-5">{errors.form}</p>
                                    }
                                </div>
                            </div> */}

                            <div className='w-full xl:mt-5 mt-2'>
                                <button className='w-full h-[40px] xl:h-[50px] rounded-3xl text-center bg-white text-black text-base xl:text-lg font-bold'>Sign Up</button>
                            </div>
                        </form>
                        <div className='flex items-center flex-col px-5 sm:px-16 my-4 xl:mt-10 gap-5 xl:gap-6 helvetica'>
                            <div className='flex items-center text-white w-full gap-2 -mt-2'>
                                <span className='border-t w-full border-gray-700'></span>
                                <p className='text-gray-200'>Or</p>
                                <span className='border-t w-full border-gray-700'></span>
                            </div>
                            <div className='flex itmes-center w-full gap-2 sm:gap-3'>
                                <button className='flex items-center justify-center rounded-3xl gap-3 googleLoginBtn w-full h-[43px] xl:h-[53px] inputBorder' onClick={() => {googleLogin()}}><img src={googleIcon} alt='user-icon' /><span className='text-white text-base	 xl:text-lg'>Google</span></button>
                                <button className='flex items-center justify-center rounded-3xl gap-3 googleLoginBtn w-full h-[43px] xl:h-[53px] inputBorder'><img src={facebookIcon} alt='user-icon' /><span className='text-white text-base xl:text-lg'>Facebook</span></button>
                            </div>
                            <p className='flex items-center gap-2'>
                                <span className='text-gray-400 text-sm sm:text-base'> Already have an account? </span><NavLink to='/login'><span className='text-white underline text-sm sm:text-base'> Sign In</span></NavLink>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;
