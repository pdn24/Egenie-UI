import { Dropdown } from "flowbite-react"
import React, { useContext, useEffect, useState } from 'react'
import '../../../assets/css/BulkFormat.css'
import disk from '../../../assets/image/Diskette.png'
import documentAdd from '../../../assets/image/Document Add.png'
// import cardImg from '../../../assets/image/cardImg.svg'
import documentText from '../../../assets/image/document-text.png'
import pen from '../../../assets/image/pen.png'
import Editor from './Editor'
import axios from "axios"
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"
import UserContext from "../../../context/userInfoContext"
import { showAlert } from "../../utils/AlertService"

export default function Template() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id')
    const navigate = useNavigate()
    const { isStoreConnected } = useContext(UserContext)
    const [currentStep, setCurrentStep] = useState(1)
    const [templateList, setTemplateList] = useState([])
    const [templateCategoryList, setTemplateCategoryList] = useState('')
    const [categoryLabel, setCalegoryLabel] = useState('Select Category...')
    const [productTitle, setProductTitle] = useState(false)
    const [productDescription, setProductDescription] = useState(false)
    const [productCategory, setProductCategoty] = useState(false)
    const [productType, setProductType] = useState(false)
    const [seoTags, setSeoTags] = useState(false)

    const [formData, setFormData] = useState({
        deliveryTime: '',
        returnWindow: '',
        returnPolicyUrl: '',
        settingName: '',
    })
    const [templateId, setTemplateId] = useState()
    const [templateName, setTemplateName] = useState()
    const [loading, setLoading] = useState(false)
    // const [edited, setEdited] = useState(false)

    const apiUrl = process.env.REACT_APP_API_URL;
    const storeId = localStorage.getItem('active_store_id')

    const changeStep = () => {
        setCurrentStep(currentStep + 1)
    }

    const handelchange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // setEdited(true)
    }

    const handleTemplateId = (id, name) => {
        setTemplateId(id)
        setTemplateName(name)
        // setEdited(true)
    }

    // const handleCheckboxChange = (setter) => {
    //     setter(prev => {
    //         setEdited(true)  
    //         return !prev
    //     })
    // }
    
    useEffect(() => {
        const token = cookies.get("login_token")
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        }
    }, [isStoreConnected, navigate])

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         if (edited) {
    //             const message = "You have unsaved changes, do you really want to leave?"
    //             event.returnValue = message // Standard for most browsers
    //             return message  // For some older browsers
    //         }
    //     }
    //     window.addEventListener("beforeunload", handleBeforeUnload)

    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload)
    //     }
    // }, [edited])

    const handleTemplateSave = async () => {
        const data = {
            user_id: userId,
            store_id: storeId,
            settings: {
                product_title_enabled: productTitle,
                product_description_enabled: productDescription,
                product_category_enabled: productCategory,
                product_type_enabled: productType,
                seo_tags_enabled: seoTags
            },
            template: templateId,
            delivery_time: formData.deliveryTime,
            return_window: formData.returnWindow,
            return_and_refund_policy_url: formData.returnPolicyUrl,
            setting_name: formData.settingName
        }
        try {
            const response = await axios.post(`${apiUrl}/templates/save_template`, data)
            showAlert(response.data.message || "Template saved successfully", "success")
            setCurrentStep(1)
        } catch (err) {
            console.log('err: ', err)
            showAlert(err.response.data.error || "Something went wrong", "error")
        }
    }

    const getTemplateList = async (id) => {
        try {
            setLoading(true)
            const response = await axios.post('https://ai.egenie-app.com/templates/get_templates', { category_id: id });
            setTemplateList(response.data)
            setLoading(false)
        } catch (err) {
            console.log('err: ', err)
            setLoading(false)
        }
    }
    const getTemplateCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/templates/get_template_categories`)
            setTemplateCategoryList(response.data)
        } catch (err) {
            console.log('err: ', err)
        }
    }
    const setOption = (id, name) => {
        setCalegoryLabel(name)
        getTemplateList(id)
    }

    useEffect(() => {
        getTemplateCategories()
    }, [])

    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold'>Template</h2>
            <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 mt-1 xl:mt-4 rounded-xl'>
                <div className="w-full relative">
                    <div className='flex items-center xl:mt-10 justify-center'>
                        <div className={`${currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 ? "opacity-100" : "opacity-20"}`}>
                            <div className='relative'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-black flex items-center justify-center' onClick={() => setCurrentStep(1)}>
                                    <img src={documentAdd} alt='document add icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                                <p className='absolute xl:-left-6 sm:-left-7 sm:-bottom-6 -left-3 xl:-bottom-8 sm:whitespace-nowrap xl:text-base sm:text-sm w-16 text-center text-xs'>Select  to edit</p>
                            </div>
                        </div>
                        <div className={`flex items-center ${currentStep === 2 || currentStep === 3 || currentStep === 4 ? "opacity-100" : "opacity-30"}`}>
                            <div className={`w-10 sm:w-20 md:w-28 border-t-2 ${currentStep === 2 || currentStep === 3 || currentStep === 4 ? "border-solid border-black" : "border-dashed border-black"}`}></div>
                            <div className='relative'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-black flex items-center justify-center' onClick={() => setCurrentStep(2)}>
                                    <img src={documentText} alt='document add icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                                <p className='absolute sm:-left-7 sm:-bottom-6 xl:-left-6 -left-1 xl:-bottom-8 sm:whitespace-nowrap w-16 xl:text-base sm:text-sm text-xs'>Choose template</p>
                            </div>
                        </div>
                        <div className={`flex items-center ${currentStep === 3 || currentStep === 4 ? "opacity-100" : "opacity-30"}`}>
                            <div className={`w-10 sm:w-20 md:w-28 h-0.5 border-t-2 ${currentStep === 3 || currentStep === 4 ? "border-solid border-black" : "border-dashed border-black"}`}></div>
                            <div className='relative'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-black flex items-center justify-center' onClick={() => setCurrentStep(3)} >
                                    <img src={pen} alt='document add icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                                <p className='absolute xl:-left-8 sm:-left-9 -left-3 text-center sm:-bottom-6 xl:-bottom-8 sm:whitespace-nowrap w-16 xl:text-base sm:text-sm text-xs'>Customize template</p>
                            </div>
                        </div>
                        <div className={`flex items-center ${currentStep === 4 ? "opacity-100" : "opacity-30"}`}>
                            <div className={`w-10 sm:w-20 md:w-28 h-0.5 border-t-2 ${currentStep === 4 ? "border-solid border-black" : "border-dashed border-black"}`}></div>
                            <div className='relative'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-full bg-black flex items-center justify-center' onClick={() => setCurrentStep(4)} >
                                    <img src={disk} alt='document add icon' className='w-5 sm:w-6 xl:w-8' />
                                </div>
                                <p className='absolute sm:-left-5 sm:-bottom-6 xl:-left-4 xl:-bottom-8 sm:whitespace-nowrap text-center xl:text-base sm:text-sm text-xs'>Save settings</p>
                            </div>
                        </div>

                    </div>
                    {currentStep === 1 &&
                        <>
                            <div className=' mt-12 xl:mt-16 px-2 xl:px-16  2xl:px-36'>
                                <h2 className='xl:text-[22px] text-base mb-2 xl:mb-5'>Choose fields to edit</h2>
                                <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 md:grid-cols-3">
                                    <div className='border max-w-[393px] rounded w-full'>
                                        <div className='flex justify-between items-center w-full py-2 px-4 cursor-pointer' onClick={() => setProductTitle(!productTitle)}>
                                            <p className='text-sm xl:text-lg'>Product Title</p>
                                            <input type="checkbox" className="w-4 h-4 rounded-xl focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                                                onChange={(e) => { e.stopPropagation(); setProductTitle(!productTitle) }}
                                                checked={productTitle} />
                                        </div>
                                    </div>
                                    <div className='border max-w-[393px] rounded w-full'>
                                        <div className='flex justify-between items-center w-full py-2 px-4 cursor-pointer' onClick={() => setProductDescription(!productDescription)}>
                                            <p className='text-sm xl:text-lg'>Product Description</p>
                                            <input type="checkbox" className="w-4 h-4 rounded-xl focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                                                onChange={(e) => { e.stopPropagation(); setProductDescription(!productDescription) }}
                                                checked={productDescription} />
                                        </div>
                                    </div>
                                    <div className='border max-w-[393px] rounded w-full'>
                                        <div className='flex justify-between items-center w-full py-2 px-4 cursor-pointer' onClick={() => setProductCategoty(!productCategory)}>
                                            <p className='text-sm xl:text-lg'>Product Category</p>
                                            <input type="checkbox" className="w-4 h-4 rounded-xl focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                                                onChange={(e) => { e.stopPropagation(); setProductCategoty(!productCategory) }}
                                                checked={productCategory} />
                                        </div>
                                    </div>
                                    <div className='border max-w-[393px] rounded w-full'>
                                        <div className='flex justify-between items-center w-full py-2 px-4 cursor-pointer' onClick={() => setProductType(!productType)}>
                                            <p className='text-sm xl:text-lg'>Product Type</p>
                                            <input type="checkbox" className="w-4 h-4 rounded-xl focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                                                onChange={(e) => { e.stopPropagation(); setProductType(!productType) }}
                                                checked={productType} />
                                        </div>
                                    </div>
                                    <div className='border max-w-[393px] rounded w-full'>
                                        <div className='flex justify-between items-center w-full py-2 px-4 cursor-pointer' onClick={() => setSeoTags(!seoTags)}>
                                            <p className='text-sm xl:text-lg'>SEO Tags</p>
                                            <input type="checkbox" className="w-4 h-4 rounded-xl focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                                                onChange={(e) => { e.stopPropagation(); setSeoTags(!seoTags) }}
                                                checked={seoTags} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 md:grid-cols-3 py-5">
                                    <div className='flex flex-col justify-between w-full gap-2'>
                                        <label className='text-sm xl:text-lg'>Delivery Time</label>
                                        <input type="text" name="deliveryTime" placeholder='Enter delivery time (enter range)' className="rounded borderLightThinGray placeholder:text-[#939393]  placeholder:text-sm focus:ring-black placeholder:xl:text-base"
                                            onChange={handelchange} />
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-2'>
                                        <label className='text-sm xl:text-lg'>Return Window</label>
                                        <input type="text" name="returnWindow" placeholder='Enter return window' className="focus:ring-black rounded borderLightThinGray placeholder:text-[#939393] placeholder:text-sm placeholder:xl:text-base"
                                            onChange={handelchange} />
                                    </div>
                                    <div className='flex flex-col justify-between w-full gap-2'>
                                        <label className='text-sm xl:text-lg'>Refund policy URL</label>
                                        <input type="text" name="returnPolicyUrl" placeholder='Enter URL' className="rounded focus:ring-black borderLightThinGray placeholder:text-[#939393] placeholder:text-sm placeholder:xl:text-base"
                                            onChange={handelchange} />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {currentStep === 2 &&
                        <>
                            <div className="templateDropdown mt-10 xl:mt-16 flex items-center justify-center gap-2  ">
                                <label className='sm:text-base text-sm'>Product Category:</label>
                                <div className='relative'>
                                    <Dropdown label={categoryLabel} className="option-height">
                                        <Dropdown.Item onClick={() => setOption(0, "Select Category...")}>Select category...</Dropdown.Item>
                                        {templateCategoryList && templateCategoryList.map((category, i) => (
                                            <React.Fragment key={i}>
                                                <Dropdown.Item onClick={() => setOption(category.category_id, category.category_name)}>{category.category_name}</Dropdown.Item>
                                            </React.Fragment>
                                        ))}
                                    </Dropdown>
                                </div>
                            </div>
                            <div className=''>

                                {loading ?
                                    (
                                        <div className='flex items-center justify-center mt-5'>
                                            <div className="spinner"></div>
                                        </div>

                                    ) : (
                                        <>
                                            {
                                                templateList.length > 0 ? (
                                                    <div className="grid gap-3 xl:gap-5 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 lg:grid-cols-4 py-5 xl:px-20">
                                                        {templateList.map((list, index) => (
                                                            <div key={index}>
                                                                <div
                                                                    className='relative h-full cursor-pointer'
                                                                    onClick={() => handleTemplateId(list.template_id, list.template_name)}
                                                                >
                                                                    <div className={`max-h-[300px] max-w-[310px] h-full  ${list.template_id === templateId ? "border-2 rounded border-black" : "border rounded border-gray-500"}`}>
                                                                        <img src={apiUrl?.concat("/", list.template_image_url)} className={`w-full h-full rounded`} alt="template img" />
                                                                    </div>
                                                                    <div className='absolute top-2 right-6' onClick={(e) => e.stopPropagation()}>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-5 h-5 rounded-full focus:right-0 checked:bg-black focus:ring-0"
                                                                            onChange={() => handleTemplateId(list.template_id, list.template_name)}
                                                                            checked={list.template_id === templateId}
                                                                        />
                                                                    </div>
                                                                    <p className={`sm:text-base text-sm  ${list.template_id === templateId ? "text-black" : "text-[#B7B7B7]"}`}>{list.template_name}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="flex justify-center items-center mt-5 text-gray-500">No Template Record found!</p>
                                                        <p className="flex justify-center items-center mt-1 text-gray-500">Select Required Product category</p>
                                                    </div>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </>
                    }
                    {currentStep === 3 &&
                        <>
                            <div className='flex justify-center mb-5'>
                                <div className='w-full mt-12 xl:mt-20 max-w-[920px] '>
                                    <h2 className='xl:text-[22px] text-base xl:mb-5 mb-1'>{templateName}</h2>
                                    <div className='flex flex-col justify-between w-full gap-2'>
                                        <label className='text-sm xl:text-lg'>Title</label>
                                        <input type="text" placeholder='Description title' className="rounded borderLightThinGray focus:ring-black placeholder:text-black  placeholder:text-sm placeholder:xl:text-base" />
                                    </div>
                                    <h4 className='py-4 xl:text-lg text-base'>Description</h4>
                                    <div className=''>
                                        <Editor />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {currentStep === 4 &&
                        <>
                            <div className='flex justify-center'>
                                <div className='w-full mt-20 max-w-[920px]'>
                                    <div className='flex flex-col justify-between w-full gap-2'>
                                        <label className='text-sm xl:text-base'>Name the settings</label>
                                        <input type="text" name="settingName" placeholder='Setting name' className="rounded borderLightThinGray focus:ring-black placeholder:text-[#939393]  placeholder:text-sm placeholder:xl:text-base" onChange={handelchange} />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className='flex justify-center items-center flex-wrap gap-2 sticky mb-0 bottom-1  xl:bottom-1 '>
                    {/* {(currentStep === 2 || currentStep === 3 || currentStep === 4) &&
                        <button className='max-w-[150px] xl:max-w-[200px] w-full xl:h-[50px] h-[40px] border bg-white border-black text-black rounded-full hover:bg-black hover:text-white font-bold ease-in-out duration-700'>Save and Exit</button>
                    } */}
                    {(currentStep === 1 || currentStep === 2 || currentStep === 3) &&
                        <button className='max-w-[150px] xl:max-w-[200px] border w-full xl:h-[50px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border-black ease-in-out duration-700' onClick={changeStep}>Next</button>
                    }
                    {currentStep === 4 &&
                        <button className='max-w-[150px] xl:max-w-[200px] border w-full xl:h-[50px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black xl:font-bold font-bold  hover:border-black  ease-in-out duration-700' onClick={handleTemplateSave}>Save Settings</button>
                    }
                </div>
                {/* <div className={`flex justify-center items-center flex-wrap gap-2 mb-3 xl:mb-10  ${currentStep === 2 ? "sticky mb-0 bottom-3  xl:bottom-16" : ""}`}>
                    {(currentStep === 1 || currentStep === 2 || currentStep === 3) &&
                        <button className='max-w-[150px] xl:max-w-[200px] border w-full xl:h-[50px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border-black ease-in-out duration-700' onClick={changeStep}>Next</button>
                    }
                    {currentStep === 4 &&
                        <button className='max-w-[150px] xl:max-w-[200px] border w-full xl:h-[50px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black xl:font-bold font-bold  hover:border-black  ease-in-out duration-700' onClick={handleTemplateSave}>Save Settings</button>
                    }
                </div> */}
            </div>
        </div>
    )
}

