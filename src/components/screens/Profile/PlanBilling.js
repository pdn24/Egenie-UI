import React, { useContext, useEffect, useState } from 'react'
import masterCardIcon from '../../../assets/icons/masterCardIcon.svg'
import logos from '../../../assets/image/creditcardlogos.svg'
// import visaCardIcon from '../../../assets/icons/visaCardIcon.svg'
import { Modal } from 'flowbite-react';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../../context/userInfoContext';
import { showAlert, showConfirmationDialog } from '../../utils/AlertService';

export default function PlanBilling() {
    const navigate = useNavigate()
    const cookies = new Cookies();
    const { userdata } = useContext(UserContext)
    const [cardsList, setCardsList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isAddressSame, setIsAddressSame] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState();

    const userId = cookies.get('user_id')
    const apiUrl = process.env.REACT_APP_API_URL;

    const [cardData, setCardData] = useState({
        cardholder_name: '',
        card_number: '',
        expiry_date: '',
        cvv: '',
        billing_address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        },
        shipping_address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        }
    });

    const [errors, setErrors] = useState({
        cardholder_name: '',
        card_number: '',
        expiry_date: '',
        cvv: '',
        billing_address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        },
        shipping_address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        }
    })

    const getCardList = async () => {
        const data = {
            user_id: userId
        }
        try {
            const response = await axios.post(`${apiUrl}/payment/get_payment_modes`, data, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log('response: ', response)
            setCardsList(response.data.payment_modes)

        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const addressType = e.target.getAttribute('data-address-type');

        setCardData(prevData => {
            if (addressType) {
                return {
                    ...prevData,
                    [addressType]: {
                        ...prevData[addressType],
                        [name]: value,
                    }
                }
            } else {
                return {
                    ...prevData,
                    [name]: value,
                }
            }
        });

        setErrors(prevErrors => {
            if (addressType) {
                return {
                    ...prevErrors,
                    [addressType]: {
                        ...prevErrors[addressType],
                        [name]: '',
                    }
                }
            } else {
                return {
                    ...prevErrors,
                    [name]: '',
                }
            }
        });

        if (isAddressSame) {
            setCardData(prevState => ({
                ...prevState,
                shipping_address: {
                    ...prevState.billing_address
                }
            }));
        }
    }

    const handleAddresses = (e) => {
        setIsAddressSame(e.target.checked)
        if (e.target.checked) {
            setCardData(prevState => ({
                ...prevState,
                shipping_address: {
                    ...prevState.billing_address
                }
            }));
        } else {
            setCardData(prevState => ({
                ...prevState,
                shipping_address: {
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    country: '',
                }
            }));
        }
    }

    const handleClose = (e) => {
        setOpenModal(false)
        setSelectedCardId()
        setErrors({
            cardholder_name: '',
            card_number: '',
            expiry_date: '',
            cvv: '',
            billing_address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            },
            shipping_address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            }
        })
        setCardData({
            cardholder_name: '',
            card_number: '',
            expiry_date: '',
            cvv: '',
            billing_address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            },
            shipping_address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            }
        })
    }

    const handleCardData = async (e) => {
        e.preventDefault()
        let formIsValid = true
        const newErrors = { ...errors }
        if (!cardData.cardholder_name) {
            newErrors.cardholder_name = 'Card holder name is required'
            formIsValid = false
        } else {
            newErrors.cardholder_name = '';
        }
        if (!cardData.card_number) {
            newErrors.card_number = 'Card number is required'
            formIsValid = false
        } else if (cardData.card_number.length < 16) {
            newErrors.card_number = 'Card number must be 16 digit'
            formIsValid = false
        }
        else {
            newErrors.card_number = '';
        }
        if (!cardData.expiry_date) {
            newErrors.expiry_date = 'Expiry Date is required'
            formIsValid = false
        }
        else if (cardData.expiry_date?.length < 5) {
            newErrors.expiry_date = 'Invalid Expiry Date'
            formIsValid = false
        }
        else if (cardData.expiry_date) {
            const [month, year] = cardData.expiry_date?.split('/').map(Number);
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear() % 100;
            if (year < currentYear) {
                newErrors.expiry_date = 'Past year not allowed'
                formIsValid = false
            } else if (month < currentMonth && year === currentYear) {
                newErrors.expiry_date = 'Invalid month'
            }
        } else {
            newErrors.expiry_date = '';
        }
        if (!cardData.cvv) {
            newErrors.cvv = 'CVV number is required'
            formIsValid = false
        } else if (cardData.cvv.length < 3) {
            newErrors.cvv = 'Card number must be 3 digit'
            formIsValid = false
        }
        else {
            newErrors.cvv = '';
        }
        // billing address error message
        if (!cardData.billing_address.line1) {
            newErrors.billing_address.line1 = 'Please enter a billing address'
            formIsValid = false
        } else {
            newErrors.billing_address.line1 = '';
        }
        if (!cardData.billing_address.line2) {
            newErrors.billing_address.line2 = 'Please enter a billing address'
            formIsValid = false
        } else {
            newErrors.billing_address.line2 = '';
        }
        if (!cardData.billing_address.city) {
            newErrors.billing_address.city = 'Please enter a city'
            formIsValid = false
        } else {
            newErrors.billing_address.city = '';
        }
        if (!cardData.billing_address.state) {
            newErrors.billing_address.state = 'Please enter a state'
            formIsValid = false
        } else {
            newErrors.billing_address.state = '';
        }
        if (!cardData.billing_address.postal_code) {
            newErrors.billing_address.postal_code = 'Please enter a postal code'
            formIsValid = false
        } else {
            newErrors.billing_address.postal_code = '';
        }
        if (!cardData.billing_address.country) {
            newErrors.billing_address.country = 'Please enter a country name'
            formIsValid = false
        } else {
            newErrors.billing_address.country = '';
        }
        // shipping address error message
        if (!cardData.shipping_address.line1) {
            newErrors.shipping_address.line1 = 'Please enter a shipping address'
            formIsValid = false
        } else {
            newErrors.shipping_address.line1 = '';
        }
        if (!cardData.shipping_address.line2) {
            newErrors.shipping_address.line2 = 'Please enter a shipping address'
            formIsValid = false
        } else {
            newErrors.shipping_address.line2 = '';
        }
        if (!cardData.shipping_address.city) {
            newErrors.shipping_address.city = 'Please enter a city'
            formIsValid = false
        } else {
            newErrors.shipping_address.city = '';
        }
        if (!cardData.shipping_address.state) {
            newErrors.shipping_address.state = 'Please enter a state'
            formIsValid = false
        } else {
            newErrors.shipping_address.state = '';
        }
        if (!cardData.shipping_address.postal_code) {
            newErrors.shipping_address.postal_code = 'Please enter a postal code'
            formIsValid = false
        } else {
            newErrors.shipping_address.postal_code = '';
        }
        if (!cardData.shipping_address.country) {
            newErrors.shipping_address.country = 'Please enter a country name'
            formIsValid = false
        } else {
            newErrors.shipping_address.country = '';
        }

        if (!formIsValid) {
            setErrors(newErrors)
            return;
        }
        try {
            if (selectedCardId === undefined) {
                const data = { ...cardData, user_id: userId, payment_type_id: 1 }
                const response = await axios.post(`${apiUrl}/payment/add_card`, data, {
                    headers: { 'Content-Type': 'application/json', },
                })
                setOpenModal(false)
                showAlert(response.data?.message || "Payment mode added successfully", "success")
                getCardList()
            } else {
                const data = { ...cardData, payment_mode_id: selectedCardId, user_id: userId, details: "tok_mastercard" }
                const response = await axios.post(`${apiUrl}/payment/edit_card`, data, {
                    headers: { 'Content-Type': 'application/json', },
                })
                setOpenModal(false)
                showAlert(response.data?.message || "Payment mode edited successfully", "success")
                getCardList()
            }
        } catch (err) {
            console.log('err: ', err)
            showAlert(err.response.data.error || "Something went wrong", 'error')
        }
    }

    const handleCardAddOrEdit = (cardId) => {
        setOpenModal(true);
        if (cardId !== undefined) {
            const selectedCard = cardsList.find((card) => card.id === cardId);
            setSelectedCardId(cardId)
            setCardData({
                cardholder_name: selectedCard.cardholder_name,
                card_number: selectedCard.card_number,
                expiry_date: selectedCard.expiry_date,
                cvv: selectedCard.cvv,
                billing_address: {
                    line1: selectedCard.billing_address.line1,
                    line2: selectedCard.billing_address.line2,
                    city: selectedCard.billing_address.city,
                    state: selectedCard.billing_address.state,
                    postal_code: selectedCard.billing_address.postal_code,
                    country: selectedCard.billing_address.country,
                },
                shipping_address: {
                    line1: selectedCard.shipping_address.line1,
                    line2: selectedCard.shipping_address.line2,
                    city: selectedCard.shipping_address.city,
                    state: selectedCard.shipping_address.state,
                    postal_code: selectedCard.shipping_address.postal_code,
                    country: selectedCard.shipping_address.country,
                }
            })
        }

    }

    // const handleEditCard = async () => {
    //     const data = { ...cardData, payment_mode_id: selectedCardId, user_id: userId }
    //     console.log('data:> ', data)
    //     try {
    //         const response = await axios.post(`${apiUrl}/payment/edit_card`, data, {
    //             headers: { 'Content-Type': 'application/json', },
    //         })
    //         console.log('response:delete ', response)
    //         setOpenEditModal(false)
    //         getCardList()
    //     } catch (err) {
    //         console.log('err: ', err)
    //         showAlert(err.response.data.error || "Something went wrong", 'error',)
    //     }
    // }

    const handleDeleteCard = async (cardId) => {
        const data = {
            payment_mode_id: cardId,
            user_id: userId
        }
        try {
            const confirmation = await showConfirmationDialog(
                "Are you sure you want to Remove ?",
                "",
                "warning"
            );
            if (confirmation) {
                const response = await axios.post(`${apiUrl}/payment/remove_card`, data, {
                    headers: { 'Content-Type': 'application/json', },
                })
                console.log('response:delete ', response)
                getCardList()
            }
        } catch (err) {
            console.log('err: ', err)
            showAlert(err.response.data.error || "Something went wrong", 'error',)
        }
    }

    const expriy_format = (value) => {
        const expdate = value;
        const expDateFormatter =
            expdate?.replace(/\//g, "").substring(0, 2) +
            (expdate?.length > 2 ? "/" : "") +
            expdate?.replace(/\//g, "").substring(2, 4);

        return expDateFormatter;
    };

    // const cc_format = (value) => {
    //     const v = value.replace(/[^0-9]/gi, "").substr(0, 16);

    //     const parts = [];
    //     for (let i = 0; i < v.length; i += 4) {
    //         parts.push(v.substr(i, 4));
    //     }
    //     return parts.length > 1 ? parts.join(" ") : value;
    // };

    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else {
            getCardList()
        }
    }, [])

    return (
        <>
            <div className='bg-gray-100 h-full helvetica p-4 2xl:p-8 w-full helvetica flex flex-col'>
                <h2 className='xl:text-3xl text-2xl font-bold'>Plan & billing</h2>
                <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 xl:mt-4 mt-1 rounded-xl'>
                    <div className='grid grid-cols-1 gap-3 xl:gap-6 sm:grid-cols-1 homeCardWrap lg:py-5 sm:px-10'>
                        <div className='w-full'>
                            <h3 className='font-bold xl:text-2xl text-xl'>Subscription</h3>
                            <div className='border mt-4 rounded flex-wrap lg:flex-nowrap lg:h-[260px]'>
                                <div className='flex gap-2 py-6 xl:px-8 px-3 items-center'>
                                    <button className='bg-black rounded text-white xl:text-lg text-base font-bold max-w-[130px] xl:max-w-[160px] h-[40px] xl:h-[44px] w-full'>{userdata?.subscription[0]?.subscription_plan}</button>
                                    <button className='text-[#28CF75] rounded bg-[#DFF8EB] xl:text-lg text-base active:font-bold max-w-[150px] xl:max-w-[177px] h-[30px] xl:h-[35px] w-full'> Subscription {userdata?.subscription[0]?.status}</button>
                                </div>
                                <p className='xl:text-lg text-[#939393] px-8'>You are currently on an {userdata?.subscription[0]?.subscription_plan} Subscription Plan at $180 {userdata?.subscription[0]?.renewal_frequency} which <span className='text-black'>renew on {userdata?.subscription[0]?.renewal_date}.</span></p>
                                <div className='flex justify-end pb-4 xl:pb-6 px-6 mt-4'>
                                    <button className='font-bold xl:text-base text-sm  w-[120px] xl:w-[160px] xl:h-[50px] h-[40px] bg-black rounded-3xl text-white'>Change Plan</button>
                                </div>
                            </div>
                        </div>
                        <div className='w-full '>
                            <div className='flex justify-between items-center gap-2'>
                                <h3 className='font-bold xl:text-2xl text-xl'>Payment methods</h3>
                                <button className='border border-[#4C4C4C] rounded px-3 py-1 sm:text-base text-sm' onClick={() => handleCardAddOrEdit()}>Add New Card</button>
                            </div>
                            <div className='border mt-3 xl:mt-4 rounded py-3 xl:py-4 px-3 xl:px-6 sm:py-6 flex flex-col gap-4 lg:h-[260px] overflow-y-auto'>
                                {cardsList && cardsList.map((card, i) =>
                                    <div key={i} className='flex justify-between gap-2 '>
                                        <div className='flex items-center gap-4 '>
                                            <div className='bg-[#E1E1E1] rounded-full flex justify-center items-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]'>
                                                <img src={masterCardIcon} alt='card_icon' />
                                            </div>
                                            <p className='text-[#939393] xl:text-lg text-base'>{card.card_number.slice(0, -3).replace(/\d/g, '*') + card.card_number.slice(-3)}</p>
                                        </div>
                                        <div className='flex gap-3 items-center'>
                                            <button className='xl:text-base text-sm underline' onClick={() => handleCardAddOrEdit(card.id)}>Edit</button>
                                            <span className='border-l h-4'></span>
                                            <button className='xl:text-base text-sm underline' onClick={() => handleDeleteCard(card.id)}>Remove</button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal dismissible show={openModal} onClose={handleClose}>
                <Modal.Header className='border-0 p-2'></Modal.Header>
                <Modal.Body className='sm:pl-10 pl-1 sm:pr-10 pr-1 sm:pb-10 pb-5 pt-0 helvetica'>
                    <div>
                        <h2 className='text-center font-bold sm:text-2xl text-xl'>{selectedCardId === undefined ? "Add New Card" : "Edit Card"}</h2>
                        <form className='mt-4' onSubmit={handleCardData}>
                            <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 xl:grid-cols-2 p-5 items-start">
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'> Cardholder Name</label>
                                    <input type="text" name='cardholder_name' value={cardData.cardholder_name} placeholder='Enter cardholder’s full name' className="rounded borderLightThinGray placeholder:text-[#939393] focus:ring-black" onChange={handleChange} />
                                    {errors.cardholder_name &&
                                        <p className='text-red-500 text-sm'>{errors.cardholder_name}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'>Card Number</label>
                                    <div className='relative w-full'>
                                        <input type="text" name='card_number' placeholder='0000  0000  0000  0000' value={cardData?.card_number} className="rounded borderLightThinGray w-full focus:ring-black placeholder:text-[#939393]"
                                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }}
                                            maxLength={16} onChange={handleChange} />
                                        <img src={logos} alt='logos' className='absolute right-2 top-2' />
                                    </div>
                                    {errors.card_number &&
                                        <p className='text-red-500 text-sm absolute -bottom-5'>{errors.card_number}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'>Expiry Date</label>
                                    <input type="text" name='expiry_date' placeholder='MM/YY' value={expriy_format(cardData?.expiry_date ? cardData?.expiry_date : "")} className="rounded datepicker focus:ring-black borderLightThinGray"
                                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }} maxLength={5} onChange={handleChange} />
                                    {errors.expiry_date &&
                                        <p className='text-red-500 text-sm'>{errors.expiry_date}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-2 relative'>
                                    <label className='text-base sm:text-lg'>CVV</label>
                                    <input type="password" name='cvv' value={cardData.cvv} placeholder='000' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]" onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }}
                                        maxLength={3} onChange={handleChange} />
                                    {errors.cvv &&
                                        <p className='text-red-500 text-sm'>{errors.cvv}</p>}
                                </div>
                            </div>

                            <p className='text-base font-bold sm:text-lg ps-5'>Billing Address:</p>
                            <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 xl:grid-cols-2 p-5 items-start">
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>Address 1</label>
                                    <input type="text" name='line1' value={cardData.billing_address.line1} placeholder='Enter address line 1' data-address-type='billing_address'
                                        className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.line1 &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.line1}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>Address 2</label>
                                    <input type="text" name='line2' value={cardData.billing_address.line2} placeholder='Enter address line 2' data-address-type='billing_address'
                                        className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.line2 &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.line2}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>City</label>
                                    <input type="text" name='city' placeholder='Enter city' value={cardData.billing_address.city} data-address-type='billing_address'
                                        className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.city &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.city}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>State</label>
                                    <input type="text" name='state' placeholder='Enter state' value={cardData.billing_address.state} data-address-type='billing_address'
                                        className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.state &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.state}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>Postal Code</label>
                                    <input type="text" name='postal_code' value={cardData.billing_address.postal_code} data-address-type='billing_address'
                                        placeholder='Enter postal code' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.postal_code &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.postal_code}</p>}
                                </div>
                                <div className='flex flex-col justify-between w-full gap-1 relative'>
                                    <label className='text-base sm:text-md'>Country</label>
                                    <input type="text" name='country' value={cardData.billing_address.country} data-address-type='billing_address'
                                        placeholder='Enter country'
                                        className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                        onChange={handleChange} />
                                    {errors.billing_address.country &&
                                        <p className='text-red-500 text-sm'>{errors.billing_address.country}</p>}
                                </div>
                            </div>

                            <p className='text-base font-bold sm:text-lg ps-5'>Shipping Address:</p>
                            <div className='ps-5'>
                                <input type='checkbox' className='xl:w-4 xl:h-4 h-4 w-4 focus:right-0 checked:bg-black focus:ring-0'
                                    onChange={handleAddresses} ></input> <span>My shipping address is the same as billing address</span>
                            </div>

                            {!isAddressSame &&
                                <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 xl:grid-cols-2 p-5 items-start">
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md' htmlFor='line1'>Address 1</label>
                                        <input type="text" name='line1' id='line1' value={cardData.shipping_address.line1} data-address-type='shipping_address'
                                            placeholder='Enter address line 1' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.line1 &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.line1}</p>}
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md'>Address 2</label>
                                        <input type="text" name='line2' value={cardData.shipping_address.line2} data-address-type='shipping_address'
                                            placeholder='Enter address line 2' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.line2 &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.line2}</p>}
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md'>City</label>
                                        <input type="text" name='city' value={cardData.shipping_address.city} data-address-type='shipping_address'
                                            placeholder='Enter city' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.city &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.city}</p>}
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md'>State</label>
                                        <input type="text" name='state' value={cardData.shipping_address.state} data-address-type='shipping_address'
                                            placeholder='Enter state' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.state &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.state}</p>}
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md'>Postal Code</label>
                                        <input type="text" name='postal_code' value={cardData.shipping_address.postal_code} data-address-type='shipping_address'
                                            placeholder='Enter postal code' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.postal_code &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.postal_code}</p>}
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-1 relative'>
                                        <label className='text-base sm:text-md'>Country</label>
                                        <input type="text" name='country' value={cardData.shipping_address.country} data-address-type='shipping_address'
                                            placeholder='Enter country' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]"
                                            onChange={handleChange} />
                                        {errors.shipping_address.country &&
                                            <p className='text-red-500 text-sm'>{errors.shipping_address.country}</p>}
                                    </div>
                                </div>
                            }
                            <div className='flex justify-center items-center flex-wrap gap-2 mt-5'>
                                <button type='reset' className='max-w-[200px] w-full sm:h-[45px] h-[40px] border border-black text-black rounded-full hover:bg-black hover:text-white font-bold ease-in-out duration-700'
                                    onClick={handleClose}>Cancel</button>
                                <button className='max-w-[200px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black ease-in-out duration-700'>{selectedCardId === undefined ? "Add Card" : "Edit Card"}</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

