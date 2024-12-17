import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import axios from 'axios';
import { showAlert } from '../../utils/AlertService';
import EgenieLogo from '../../../assets/icons/EgenieLogo.svg';
import Footer from '../../Footer'; 
import { useLocation, useNavigate } from 'react-router-dom'; 

function SetPassword({ token }) {
    const location = useLocation();
    const navigate = useNavigate(); 
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId"); // Extract userId from the URL
    const [formData, setFormData] = useState({
        token: token,
        user_id: userId,
        new_password: '',
        confirm_password: '',
    });
    const [errors, setErrors] = useState({
        new_password: '',
        confirm_password: '',
    });
    const [openModal, setOpenModal] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };
        if (!formData.new_password) {
            newErrors.new_password = 'Please enter a new password';
            formIsValid = false;
        } else {
            newErrors.new_password = '';
        }
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please enter a confirm password';
            formIsValid = false;
        } else {
            newErrors.confirm_password = '';
        }

        if (!formIsValid) {
            setErrors(newErrors);
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/user/set_password`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            showAlert(response.data?.message || "Password set successfully", "success");
            navigate('/login', { state: { fromSetPassword: true } });
        } catch (err) {
            console.log('err: ', err);
            showAlert(err.response?.data?.error || "Something went wrong", 'error');
        }
    };

    return (
        <>
            {/* Egenie styled header */}
            <header className='bg-black p-4'>
                <div className='flex justify-center'>
                    <img src={EgenieLogo} width="75px" alt='Egenie Logo' />
                </div>
            </header>

            <div className='bg-gray-900 text-white h-screen flex justify-center items-center'>
                <Modal show={openModal} position="center" size="md">
                    <Modal.Body className='p-5 bg-black rounded-lg'>
                        {/* Removed Modal.Header and added custom title text */}
                        <div className='text-center mb-5'>
                            <h2 className='font-bold text-xl text-gray-200'>Set New Password</h2>
                        </div>
                        <form onSubmit={handleSetPassword}>
                            <div className="flex flex-col gap-5">
                                {/* New Password Field */}
                                <div className='flex flex-col'>
                                    <label className='text-lg text-gray-300 mb-2'>New Password</label>
                                    <input type="password" name='new_password' placeholder='Enter new password' className="p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-gray-700 focus:outline-none"
                                        onChange={handleChange} />
                                    {errors.new_password &&
                                        <p className='text-red-500 text-sm mt-1'>{errors.new_password}</p>}
                                </div>

                                {/* Confirm Password Field */}
                                <div className='flex flex-col'>
                                    <label className='text-lg text-gray-300 mb-2'>Confirm Password</label>
                                    <input type="password" name='confirm_password' placeholder='Enter confirm password' className="p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-gray-700 focus:outline-none"
                                        onChange={handleChange} />
                                    {errors.confirm_password &&
                                        <p className='text-red-500 text-sm mt-1'>{errors.confirm_password}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='flex justify-center mt-5'>
                                <button className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-bold py-2 px-6 rounded-full transition-all duration-300'>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>

            {/* Egenie Footer */}
            <Footer />
        </>
    );
}

export default SetPassword;
