import React, { useContext, useEffect, useState } from 'react';
import email from '../../assets/image/Letter.svg';
import password from '../../assets/image/LockPassword.svg';
import "../../assets/css/signup.css";
import "../../assets/css/loader.css";
import EgenieLogo from '../../assets/icons/EgenieLogo.svg';
import googleIcon from '../../assets/image/google.svg';
import facebookIcon from '../../assets/image/facebook.svg';
import { Link, useNavigate } from 'react-router-dom';
import sendIcon from '../../assets/icons/sendIcon.svg';
import closeIcon from '../../assets/icons/closeIconWhite.svg';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import UserContext from '../../context/userInfoContext';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const cookies = new Cookies();
    const { fetchUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        username: '',
        password: '',
        login_type: 'login',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        form: "",
    });
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };
        if (!formValue.username) {
            newErrors.username = "Email is required.";
            formIsValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValue.username)) {
            newErrors.username = 'Please enter a valid email address';
            formIsValid = false;
        } else {
            newErrors.username = "";
        }
        if (!formValue.password) {
            newErrors.password = "Password is required.";
            formIsValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(formValue.password)) {
            newErrors.password = 'Please enter a valid password';
            formIsValid = false;
        } else {
            newErrors.password = "";
        }
        if (!formIsValid) {
            setErrors(newErrors);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/auth`, formValue, {
                headers: { 'Content-Type': 'application/json' },
            });
            const login_token = response.data?.access_token;
            cookies.set('login_token', login_token);
            cookies.set('user_id', response.data?.user?.id);
            localStorage.setItem("user_info", JSON.stringify(response.data?.user));
            const activeStore = response.data?.user?.stores.find((store) => store.is_selected === true);
            localStorage.setItem("active_store_id", activeStore?.id);
            setFormValue({ username: "", password: "" });
            setErrors({ username: "", password: "", form: "" });
            fetchUserInfo(response.data?.user?.id);
            navigate("/connectstore2", { state: { isConnectNewStore: true } });
        } catch (error) {
            console.log("login error", error);
            setErrors({ ...errors, form: error.response?.data[0] || error.message || "Something went wrong" });
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json',
                    },
                });

                // Send user info to your backend
                const loginResponse = await axios.post(`${apiUrl}/auth`, {
                    username: response.data.email,
                    login_type: 'google',
                });

                const login_token = loginResponse.data?.access_token;
                cookies.set('login_token', login_token);
                cookies.set('user_id', loginResponse.data?.user?.id);
                localStorage.setItem("user_info", JSON.stringify(loginResponse.data?.user));
                const activeStore = loginResponse.data?.user?.stores.find((store) => store.is_selected === true);
                localStorage.setItem("active_store_id", activeStore?.id);
                fetchUserInfo(loginResponse.data?.user?.id);
                navigate("/connectstore2", { state: { isConnectNewStore: true } });

            } catch (error) {
                console.error("Google login error:", error);
            }
        },
        onError: (error) => {
            console.log('Google login error:', error);
        },
    });

    const handleGoToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        const token = cookies.get("login_token");
        if (token) {
            navigate('/home2');
        }
    }, []);

    return (
        <div>
            <div className="">
                <div className='loginPageBg h-screen overflow-y-auto pt-2 xl:pt-5 px-6 md:px-28 flex flex-col'>
                    <div className='flex justify-center mt-3 sm:mt-0 sm:justify-between items-center relative'>
                        <img src={EgenieLogo} width='80px' alt="icons" />
                        <button className='hidden sm:block text-white signUpBtn w-[170px] xl:w-[185px] h-[44px] rounded-full' onClick={handleGoToHome}>
                            <div className='flex justify-center gap-2 items-center'>
                                <img src={sendIcon} className='arrow-rotate w-3' alt='sendicon' />
                                <span>Go to home</span>
                            </div>
                        </button>
                        <button className='text-white signUpBtn w-[43px] absolute sm:relative h-[43px] rounded-full sm:hidden right-0' onClick={handleGoToHome}>
                            <div>
                                <img src={closeIcon} className='closeIcon' alt='closeitem' />
                            </div>
                        </button>
                    </div>
                    <div className='lg:border-b border-gray-800 xl:pt-8 pt-2'></div>
                    <div className='flex justify-center items-center h-full my-4'>
                        <div className='loginPageCard xl:max-w-[520px] max-w-[400px] h-full flex items-center max-h-[600px] shadow-gray-800 shadow-sm'>
                            <div className='w-full'>
                                {loading &&
                                    <div className='flex items-center justify-center'>
                                        <div className="spinner"></div>
                                    </div>
                                }
                                <h2 className='text-white text-center text-[26px] sm:text-3xl xl:text-4xl xl:mt-8 mt-2 author'>Log in to your account</h2>
                                <form className='flex items-center flex-col px-5 sm:px-10 xl:px-16 xl:mt-10 mt-3 gap-6 helvetica' onSubmit={handleSubmit}>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label className='text-gray-300 label-font xl:text-base text-sm'>Email</label>
                                        <div className='relative'>
                                            <span className='absolute align-user'><img src={email} alt='user-icon' /></span>
                                            <input
                                                id="username"
                                                name="username"
                                                type="email"
                                                placeholder='Enter your email'
                                                onChange={handleChange}
                                                className="h-[44px] xl:h-[50px] w-full pl-14 bg-transparent inputBorder rounded-full googleLoginBtn text-white placeholder:text-gray-400 xl:text-md sm:leading-6 focus:border-none focus:ring-white"
                                            />
                                            {errors.username && (
                                                <p className="text-red-500 text-sm ms-5 absolute -bottom-6">{errors.username}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label className='text-gray-300 label-font'>Password</label>
                                        <div className='relative'>
                                            <span className='absolute align-user'><img src={password} alt='user-icon' /></span>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder='Enter your Password'
                                                onChange={handleChange}
                                                autoComplete="true"
                                                className="h-[44px] xl:h-[50px] w-full pl-14 bg-transparent googleLoginBtn inputBorder rounded-full text-white  placeholder:text-gray-400 xl:text-md sm:leading-6 focus:border-none focus:ring-white"
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-sm ms-5 absolute -bottom-6">{errors.password}</p>
                                            )}
                                            {errors.form && (
                                                <p className="text-red-500 text-sm ms-5 absolute -bottom-6">{errors.form}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='w-full xl:mt-5 mt-2'>
                                        <button className='w-full h-[42px] xl:h-[50px] rounded-3xl text-center bg-white text-black text-base xl:text-lg font-bold'>Log In</button>
                                    </div>
                                </form>
                                <div className='flex items-center flex-col px-5 sm:px-10 xl:px-16 xl:mt-10 mt-3 gap-6 helvetica'>
                                    <div className='flex items-center text-white w-full gap-2'>
                                        <span className='border-t w-full border-gray-700'></span>
                                        <p className='text-gray-200'>Or</p>
                                        <span className='border-t w-full border-gray-700'></span>
                                    </div>
                                    <div className='flex items-center w-full gap-3'>
                                        <button
                                            className='flex items-center justify-center rounded-3xl gap-3 googleLoginBtn w-full h-[44px] xl:h-[50px] inputBorder'
                                            onClick={() => handleGoogleLogin()}
                                        >
                                            <img src={googleIcon} alt='Google icon' />
                                            <span className='text-white text-sm xl:text-base'>Google</span>
                                        </button>
                                        <button className='flex items-center justify-center rounded-3xl gap-3 googleLoginBtn w-full h-[44px] xl:h-[50px] inputBorder '>
                                            <img src={facebookIcon} alt='user-icon' />
                                            <span className='text-white text-sm xl:text-base'>Facebook</span>
                                        </button>
                                    </div>
                                    <p className='flex items-center gap-2 pb-4'>
                                        <span className='text-gray-400 text-sm xl:text-base'> Don't have an account?</span>
                                        <Link to='/register'>
                                            <span className='text-white underline text-sm xl:text-base'>Sign Up</span>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
