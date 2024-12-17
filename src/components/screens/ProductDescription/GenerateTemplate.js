import { Dropdown } from "flowbite-react"
import React, { useContext, useEffect, useState, useRef } from 'react'
import '../../../assets/css/BulkFormat.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import axios from "axios"
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"
import UserContext from "../../../context/userInfoContext"
import { showAlert } from "../../utils/AlertService"

export default function GenerateTemplate() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id')
    const navigate = useNavigate()
    const { isStoreConnected } = useContext(UserContext)   
    const [templateList, setTemplateList] = useState([])
    const [productTypeList, setproductTypeList] = useState([])
    const [productTypeLabel, setProductTypeLabel] = useState('Select Product Type')
    const [templateLabel, setTemplateLabel] = useState('Select Existing Template')   
    const [loading, setLoading] = useState(false)
    const [editorContent, setEditorContent] = useState(''); // State for Quill editor content
    const [isEditable, setIsEditable] = useState(false); // Add state for isEditable
    const [contentGenerated, setContentGenerated] = useState(false); // State for content generated
    const [isSaveHidden, setIsSaveHidden] = useState(true); // State for save button hidden
    const apiUrl = process.env.REACT_APP_API_URL;
    const storeId = localStorage.getItem('active_store_id')

    
    
    useEffect(() => {
        const token = cookies.get("login_token")
        console.log('In GenerateTemplate - useeffect: isStoreConnected: ', isStoreConnected)
        if (!token) {
            navigate('/login')
        } else if (!isStoreConnected) {
            navigate('/connectstore2')
        }
    }, [isStoreConnected, navigate])


    const handleSaveTemplate = async () => {
        console.log("handleSaveTemplate templateLabel: ", templateLabel);
        if (templateLabel !== 'Select Existing Template') {
            const templateId = templateList.find(template => template.template_name === templateLabel)?.id;
            if (templateId) {
                handleEditTemplate(templateId);
            }
        } else {
            const templateName = await new Promise((resolve) => {
                const modal = document.createElement('div');
                modal.innerHTML = `
                    <div class="fixed inset-0 flex items-center justify-center z-50">
                        <div class="bg-white p-6 rounded-lg shadow-lg helvetica">
                            <h2 class="text-lg font-bold mb-4 helvetica">Please enter the template name:</h2>
                            <input type="text" id="templateNameInput" class="border p-2 w-full mb-4 helvetica" />
                            <div class="flex justify-end gap-4">
                                <button id="confirmSave" class="bg-black text-white py-1 px-4 rounded-3xl helvetica">Save</button>
                                <button id="cancelSave" class="bg-gray-500 text-white py-1 px-4 rounded-3xl helvetica">Cancel</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                const confirmSaveButton = document.getElementById('confirmSave');
                const cancelSaveButton = document.getElementById('cancelSave');
                const templateNameInput = document.getElementById('templateNameInput');

                if (confirmSaveButton && cancelSaveButton && templateNameInput) {
                    confirmSaveButton.onclick = () => {
                        resolve(templateNameInput.value);
                        document.body.removeChild(modal);
                    };
                    cancelSaveButton.onclick = () => {
                        resolve(null);
                        document.body.removeChild(modal);
                    };
                } else {
                    console.error("Modal elements not found");
                    resolve(null);
                    document.body.removeChild(modal);
                }
            });

            if (!templateName) {
                showAlert("Template name is required", "error");
                return;
            }

            const data = {
                user_id: userId,
                store_id: storeId,
                setting_name: templateName,
                product_description_text: editorContent // Use the state for editor content
            };
            try {
                const response = await axios.post(`${apiUrl}/templates/save_formatting_template`, data);
                showAlert(response.data.message || "Template saved successfully", "success");
                setIsSaveHidden(true); // Hide save button on successful save
                await getTemplateList(); // Reload the template list dropdown
            } catch (err) {
                console.log('err: ', err);
                showAlert(err.response.data.error || "Something went wrong", "error");
            }
        }
    };

    const handleEditTemplate = async (templateId) => {      
       
        const data = {
            user_id: userId,
            store_id: storeId,
            template_id: templateId,
            product_description_text: editorContent // Use the state for editor content
        };
        try {
            const response = await axios.put(`${apiUrl}/templates/edit_formatting_template/${templateId}`, data);
            showAlert(response.data.message || "Template updated successfully", "success");
            setIsSaveHidden(true); // Hide save button on successful save
            await getTemplateList(); // Reload the template list dropdown
        } catch (err) {
            console.log('err: ', err);
            showAlert(err.response.data.error || "Something went wrong", "error");
        }
    };

    const getTemplateList = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/templates/get_templates`, {                 
                user_id: userId,
                store_id: storeId
            });
            console.log("Inside getTemplateList", response.data)
            setTemplateList(response.data)
            console.log(templateList);
            setLoading(false)
        } catch (err) {
            console.log('err: ', err)
            setLoading(false)
        }
    }
    const getProductTypeList= async () => {
        try {          
            const response = await axios.post(`${apiUrl}/shopify/get_product_types`, {                 
                user_id: userId,
                store_id: storeId
            });
            setproductTypeList(response.data.product_types)
        } catch (err) {
            console.log('err: ', err)
        }
    } 

    useEffect(() => {
        getProductTypeList()
        getTemplateList()       
    }, [])

          
    const handleGenerate = async () => {
        setLoading(true); // Start loading animation
        const data = {
            user_id: userId,
            store_id: storeId,
            product_type: productTypeLabel,
            product_description_sample: editorContent
        };
        try {
            const response = await axios.post(`${apiUrl}/templates/generate_template_suggestions`, data);
            setEditorContent(response.data.template_suggestion || ""); // Set the response to the editor
            setContentGenerated(true); // Set content generated to true
            setIsSaveHidden(false); // Show save button after generate
        } catch (err) {
            console.log('err: ', err);
            showAlert(err.response.data.error || "Something went wrong", "error");
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold mb-4'>Generate Template</h2>
            <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 rounded-xl'>
                <div className="w-full relative">
                    <div className='flex items-center justify-start'>
                        <div className='w-full flex flex-col items-start gap-4'>
                            <div className='w-full max-w-[800px]'>
                                <div className='templateDropdown flex items-center justify-start gap-2'>
                                    <label className='sm:text-base text-sm'>Product Type:</label>
                                    <div className='relative'>
                                        <Dropdown label={productTypeLabel} className='option-height'>
                                            {productTypeList.map((productType, index) => (
                                                <Dropdown.Item key={index} onClick={() => {
                                                    setProductTypeLabel(productType);
                                                    setEditorContent(''); // Clear the contents of the editor
                                                }}>
                                                    {productType}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown>
                                    </div>                    
                                    
                                </div>
                                <div className='mt-4'>
                                    {/* Quill Editor */}
                                    <ReactQuill value={editorContent} onChange={setEditorContent} readOnly={!isEditable} />
                                </div>
                            </div>
                            <div className='flex items-center gap-4 mt-4'>
                                <button 
                                    className={`w-[100px] h-[40px] bg-black text-white rounded-full font-bold hover:bg-white hover:text-black hover:border hover:border-black ease-in-out duration-700`} 
                                    onClick={handleGenerate}
                                >
                                    Generate
                                </button>
                                {contentGenerated && !isSaveHidden && (
                                    <button className='w-[100px] h-[40px] bg-black text-white rounded-full font-bold hover:bg-white hover:text-black hover:border hover:border-black ease-in-out duration-700' onClick={handleSaveTemplate}>Save</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
