import React, { useContext, useEffect, useState } from 'react'
import error from '../../../assets/image/error.jpg'
import { Cookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import axios from 'axios';
import { showAlert } from '../../utils/AlertService';
import UserContext from '../../../context/userInfoContext';

function ResetPassword() {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const { token } = useParams();
    const [formData, setFormData] = useState({
        user_id: cookies.get('user_id'),
        token: token,
        new_password: '',
        confirm_password: '',
    })
    const [errors, setErrors] = useState({
        new_password: '',
        confirm_password: '',
    })
    const [openModal, setOpenModal] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const { handleLogOut } = useContext(UserContext)


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }


    const handleResetPassword = async (e) => {
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
            const response = await axios.post(`${apiUrl}/user/update_password`, formData, {
                headers: { 'Content-Type': 'application/json', },
            })
            handleLogOut()
            showAlert(response.data?.message || "Password updated successfully", "success")
        } catch (err) {
            console.log('err: ', err)
            showAlert(err.response?.data?.error || "Something went wrong", 'error')
        }
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
                <h2 className='xl:text-3xl text-2xl font-bold'>Reset Password</h2>
            </div>

            <Modal show={openModal} position="center" size="md">
                <Modal.Body className='sm:pl-10 pl-1 sm:pr-10 pr-1 sm:pb-10 pb-5 pt-5 helvetica'>
                    <div>
                        <h2 className='text-center font-bold sm:text-2xl text-xl'>Reset Password</h2>
                        <form onSubmit={handleResetPassword}>
                            <div className="grid grid-cols-1 gap-7 sm:grid-cols-1 xl:grid-cols-1 p-5 items-start">
                                <div className='flex flex-col justify-between w-full gap-0 relative'>
                                    <label className='text-base sm:text-lg'>New Password</label>
                                    <div className='relative w-full'>
                                        <input type="password" name='new_password' placeholder='Enter new password' className="rounded borderLightThinGray w-full placeholder:text-[#939393] focus:ring-black"
                                            onChange={handleChange} />
                                    </div>
                                    {errors.new_password &&
                                        <p className='text-red-500 text-sm absolute -bottom-5'>{errors.new_password}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-0 relative'>
                                    <label className='text-base sm:text-lg'>Confirm Password</label>
                                    <div className='relative w-full'>
                                        <input type="password" name='confirm_password' placeholder='Enter confirm password' className="rounded borderLightThinGray w-full focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                    </div>
                                    {errors.confirm_password &&
                                        <p className='text-red-500 text-sm absolute -bottom-5'>{errors.confirm_password}</p>}
                                </div>

                            </div>
                            <div className='flex justify-center items-center flex-wrap gap-2 mt-5'>
                                {/* <button type='reset' className='max-w-[200px] w-full sm:h-[45px] h-[40px] border border-black text-black rounded-full hover:bg-black hover:text-white font-bold ease-in-out duration-700' onClick={handleClose}>Cancel</button> */}
                                <button className='max-w-[200px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black ease-in-out duration-700'>Submit</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ResetPassword
