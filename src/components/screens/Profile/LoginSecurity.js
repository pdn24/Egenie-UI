import React, { useContext, useEffect, useState } from 'react'
import error from '../../../assets/image/error.jpg'
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { showAlert } from '../../utils/AlertService';
import axios from 'axios';
import UserContext from '../../../context/userInfoContext';


function LoginSecurity() {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const userId = cookies.get('user_id')
    const { userdata } = useContext(UserContext)

    const [formData, setFormData] = useState({
        user_id: userId,
        old_password: '',
        new_password1: '',
        new_password2: '',
    })
    const [errors, setErrors] = useState({
        old_password: '',
        new_password1: '',
        new_password2: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }
    const resetForm = () => {
        setFormData({ ...formData, old_password: "", new_password1: "", new_password2: "" })
        setErrors({ ...errors, old_password: "", new_password1: "", new_password2: "" })

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        let formIsValid = true
        const newErrors = { ...errors }
        if (!formData.old_password) {
            newErrors.old_password = 'Old password is required'
            formIsValid = false
        }else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(formData.old_password)) {
            newErrors.old_password = 'Old Password  must be at least 8 characters long and include at least one special character and one number'
            formIsValid = false
        } else {
            newErrors.old_password = '';
        }

        if (!formData.new_password1) {
            newErrors.new_password1 = 'New password is required'
            formIsValid = false
        }else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(formData.new_password1)) {
            newErrors.new_password1 = 'New Password  must be at least 8 characters long and include at least one special character and one number'
            formIsValid = false
        } else {
            newErrors.new_password1 = '';
        }

        if (!formData.new_password2) {
            newErrors.new_password2 = 'Confirm new password is required'
            formIsValid = false
        }else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(formData.new_password2)) {
            newErrors.new_password2 = 'Confirm new Password  must be at least 8 characters long and include at least one special character and one number'
            formIsValid = false
        } else {
            newErrors.new_password2 = '';
        }

        if (!formIsValid) {
            setErrors(newErrors)
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/user/change_password`, formData, {
                headers: { 'Content-Type': 'application/json', },
            })
            showAlert(response.data.success || "Password changed successfully", "success")
            resetForm()
        } catch (e) {
            console.log('e: ', e)
            showAlert(e.response.data.message || "Something went wrong", "error")
        }
    }

    const handleResetLink = async () => {
        const data = {
            email: userdata?.email
        }
        try {
            setIsLoading(true)
            const response = await axios.post(`${apiUrl}/user/forgot_password`, data, {
                headers: { 'Content-Type': 'application/json', },
            })
            showAlert(response.data.message, "success")
        } catch (err) {
            console.log('err: ', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = (e) => {
        e.preventDefault()
        let formIsValid = true
        const newErrors = { ...errors }
        if (!formData.new_password) {
            newErrors.new_password = 'Please enter a new password'
            formIsValid = false
        } else {
            newErrors.new_password = '';
        }
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please enter a comfirm password'
            formIsValid = false
        } else {
            newErrors.confirm_password = '';
        }

        if (!formIsValid) {
            setErrors(newErrors)
            return;
        }
        try {

        } catch (e) {
            console.log(e);
        }
    }

    const handleClose = (e) => {
        setOpenModal(false)
        setErrors({})
    }

    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        }
    }, [])

    return (
        <>
            <div className='bg-gray-100 h-full helvetica p-4 2xl:p-8 w-full helvetica flex flex-col'>
                <h2 className='xl:text-3xl text-2xl font-bold'>Login & security</h2>
                <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray py-8 sm:px-12 px-4 xl:mt-4 mt-1 rounded-xl'>
                    <div className='flex justify-between flex-wrap gap-3'>
                        <h2 className='text-xl lg:text-2xl font-bold'>Change password</h2>
                        {isLoading ? (
                            <div className='flex items-center justify-center'>
                                <div className="spinner" style={{ width: "35px", height: "35px" }}></div>
                            </div>
                        ) : (
                            <div className='underline cursor-pointer' onClick={handleResetLink}>Forgot password?</div>
                        )}
                    </div>
                    <div className='border rounded-lg mt-4'>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 homeCardWrap items-start p-5">
                                <div className='flex flex-col justify-between w-full gap-2'>
                                    <label className='text-base xl:text-lg'>Old password</label>
                                    <input type="password" name='old_password' value={formData.old_password} className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]" onChange={handleChange} />
                                    {errors.old_password &&
                                        <div className='flex items-center'>
                                            <p className='text-red-500 text-sm'>{errors.old_password}</p>
                                        </div>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2'>
                                    <label className='text-base xl:text-lg'>New password</label>
                                    <input type="password" name='new_password1' value={formData.new_password1} className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]" onChange={handleChange} />
                                    {errors.new_password1 &&
                                        <p className='text-red-500 text-sm'>{errors.new_password1}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2'>
                                    <label className='text-base xl:text-lg'>Confirm password</label>
                                    <input type="password" name='new_password2' value={formData.new_password2} className="rounded borderLightThinGray focus:ring-black   placeholder:text-[#939393]" onChange={handleChange} />
                                    {errors.new_password2 &&
                                        <p className='text-red-500 text-sm'>{errors.new_password2}</p>}
                                </div>

                            </div>
                            <div className='flex justify-center items-center flex-wrap gap-2 mb-7'>
                                <button className='max-w-[150px] xl:max-w-[200px] w-full xl:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black  ease-in-out duration-700' >Submit</button>
                                <button type='reset' className='max-w-[150px] xl:max-w-[200px] w-full xl:h-[45px] h-[40px] border border-black text-black rounded-full hover:bg-black hover:text-white font-bold ease-in-out duration-700' onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* reset password */}

            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header className='border-0 p-2'></Modal.Header>
                <Modal.Body className='sm:pl-10 pl-1 sm:pr-10 pr-1 sm:pb-10 pb-5 pt-0 helvetica'>
                    <div>
                        <h2 className='text-center font-bold sm:text-2xl text-xl'>Reset Password</h2>
                        <form className='mt-4' onSubmit={handleResetPassword}>
                            <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 xl:grid-cols-2 p-5 items-start">
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'>New Password</label>
                                    <input type="text" name='new_password' placeholder='Enter new password' className="rounded borderLightThinGray placeholder:text-[#939393] focus:ring-black" onChange={handleChange} />
                                    {errors.new_password &&
                                        <p className='text-red-500 text-sm'>{errors.new_password}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'>Confirm Password</label>
                                    <div className='relative w-full'>
                                        <input type="text" name='confirm_password' placeholder='Enter confirm password' className="rounded borderLightThinGray w-full focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                    </div>
                                    {errors.confirm_password &&
                                        <p className='text-red-500 text-sm absolute -bottom-5'>{errors.confirm_password}</p>}
                                </div>

                            </div>
                            <div className='flex justify-center items-center flex-wrap gap-2 mt-5'>
                                <button className='max-w-[200px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black ease-in-out duration-700'>Submit</button>
                                <button type='reset' className='max-w-[200px] w-full sm:h-[45px] h-[40px] border border-black text-black rounded-full hover:bg-black hover:text-white font-bold ease-in-out duration-700' onClick={handleClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LoginSecurity
