import React, { useContext, useEffect, useState } from 'react'
import rigthIcon from '../../../assets/icons/right-icon.svg'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { Alert } from 'flowbite-react';
import { showAlert } from '../../utils/AlertService';
import infoDark from '../../../assets/icons/InfoDark.svg'
import UserContext from '../../../context/userInfoContext';

export default function AddStaff() {

    const cookies = new Cookies();
    const navigate = useNavigate()
    const { isStoreConnected, userdata } = useContext(UserContext)
    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = cookies.get('user_id')
    const activeStore = userdata?.stores.find((store) => store.is_selected === true)

    const [formValues, setFormValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role_id: 0,
        requestor_user_id: parseInt(userId),
    })
    console.log('formValues: ', formValues)
    const [userRoles, setUserRoles] = useState([])

    const validForm = (formValues.first_name && formValues.last_name && formValues.email && formValues.role_id) ? true : false

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        form: '',
    })
    console.log('errors: ', errors)

    const handlePermission = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const getUserRoles = async () => {
        try {
            const response = await axios.get(`${apiUrl}/user/get_user_roles`)
            console.log('response: ', response)
            setUserRoles(response.data)
            setErrors({ ...errors, form: "" })
        } catch (err) {
            console.log('err: ', err)
            showAlert("Service Unavailable! please try after sometime ", 'error')
            setErrors({ ...errors, form: "Error in fetching user roles" })
        }
    }

    const handleInvitation = async () => {
        let formIsValid = true;
        const newErrors = { ...errors };
        if (!formValues.first_name) {
            newErrors.first_name = "First name is required"
            formIsValid = false;
        } else {
            newErrors.first_name = "";
        }
        if (!formValues.last_name) {
            newErrors.last_name = "Last name is required"
            formIsValid = false;
        } else {
            newErrors.last_name = ""
        }
        if (!formValues.email) {
            newErrors.email = "Email is required"
            formIsValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
            newErrors.email = 'Please enter a valid email address'
            formIsValid = false
        } else {
            newErrors.email = ""
        }
        if (!formValues.role_id) {
            newErrors.role_id = "Permissions is required"
            formIsValid = false;
        } else {
            newErrors.role_id = ""
        }
        if (!formIsValid) {
            setErrors(newErrors)
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/user/add_user`, formValues, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log('response: ', response)
            showAlert(response.data.message, "success")
            setTimeout(
                navigate('/userandpermission', {
                    state: {
                        staffData: formValues
                    }
                }), 1000)
        } catch (error) {
            console.log('error: ', error)
            showAlert(error.response.data.error || "Something went wrong", "error")

        }
    }

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: "" })
    }

    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        }
        else {
            getUserRoles()
        }
    }, [])

    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-4'>
                    <button className='bg-white p-1 sm:p-0 sm:w-[35px] xl:w-[42px] xl:h-[42px] sm:h-[35px] rounded-[30px] border border-black flex items-center justify-center'><img src={rigthIcon} alt='back' onClick={() => navigate('/userandpermission')} /></button>
                    <h2 className='xl:text-[32px] text-xl sm:text-2xl font-bold'>Add staff</h2>
                </div>
                <button className={`bg-black flex items-center justify-center gap-3 ${validForm ? 'opacity-100' : 'opacity-20'} rounded-[50px] w-[120px] xl:w-[200px] xl:h-[50px] lg:h-[45px] h-[36px]`} onClick={handleInvitation} disabled={!validForm}>
                    <span className='text-white text-sm lg:text-base '>Send Invite</span>
                </button>
            </div>
            <div className='w-full h-full whiteBgHeight overflow-y-auto bg-white shadow shadow-gray xl:mt-4 mt-1 px-3 md:px-6 xl:px-12 py-3 xl:py-8 rounded-xl'>
                <h4 className='sm:text-xl text-lg font-bold'>Staff</h4>
                <p className='text-gray-400 xl:text-xl md:text-base text-sm'>Give staff access to your store by sending them an invitation. If you’re working with a designer, developer, or marketer, find out how <span className='text-black block'>to give collaborator access to your store.</span></p>

                <div className='bg-white border mt-4 p-3 rounded-lg'>
                    <form>
                        <div className='flex gap-3 flex-wrap md:flex-nowrap'>
                            <div className='flex flex-col max-w-[423px] w-full gap-2'>
                                <label className='text-base xl:text-lg'>First name</label>
                                <input type="text" name='first_name' className="rounded borderLightThinGray focus:ring-black max-w-[423px] h-[35px] sm:h-[40px] xl:h-[50px] placeholder:text-[#939393]" onChange={handleChange} />
                            </div>
                            <div className='flex flex-col max-w-[423px] w-full gap-2'>
                                <label className='text-base xl:text-lg'>Last name</label>
                                <input type="text" name='last_name' className="rounded borderLightThinGray focus:ring-black max-w-[423px] h-[35px] sm:h-[40px] xl:h-[50px] placeholder:text-[#939393]" onChange={handleChange} />
                            </div>
                        </div>
                        <p className='xl:py-3 py-2 text-gray-400 xl:text-xl md:md:text-base text-sm'>Enter the staff member’s first and last name as they appear on their government-issued ID.</p>
                        <div className='flex flex-col justify-between w-full gap-2'>
                            <label className='text-base xl:text-lg'>Email</label>
                            <input type="text" name='email' className="rounded borderLightThinGray focus:ring-black max-w-[423px] h-[35px] sm:h-[40px] xl:h-[50px] placeholder:text-[#939393]" onChange={handleChange} />
                        </div>
                        {errors.email &&
                            <p className='text-red-500 text-sm ms-1'>{errors.email}</p>}
                    </form>
                </div>
                <div className='bg-white border mt-2 sm:mt-5 rounded-lg'>
                    <div className='border-b xl:px-5 px-2 py-3'>
                        <div className='flex gap-2 items-center'>
                            <h3 className='font-bold md:text-xl text-base flex gap-2 items-center'>Store Permissions<span><img src={infoDark} alt="info_icon" /></span></h3>
                        </div>
                        <p className='mt-1 text-gray-400 xl:text-xl md:text-base text-sm'>Manage permissions for {activeStore?.shopify_store_name}</p>
                    </div>

                    <div className='flex gap-3 xl:px-5 px-2 py-3 admin-radio-input' >
                        {userRoles &&
                            userRoles.map((role, i) => (
                                <div className='flex gap-2 items-center' key={i}>
                                    <input type='radio' name='role_id' value={role.id} className='accent-black' onClick={handlePermission} />
                                    <label>{role.name}</label>
                                </div>
                            ))
                        }
                        {errors.form && (
                            <p className="text-red-500 text-sm ms-5 -bottom-6">{errors.form}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
