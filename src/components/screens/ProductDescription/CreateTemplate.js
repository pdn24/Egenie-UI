import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/css/BulkFormat.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/userInfoContext";
import { showAlert } from "../../utils/AlertService";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CreateTemplate() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id');
    const navigate = useNavigate();
    const { isStoreConnected, userdata } = useContext(UserContext);
    const [templateList, setTemplateList] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const storeId = localStorage.getItem('active_store_id');
    const [templateName, setTemplateName] = useState('');
  
    const store = userdata?.stores?.find(store => store.id === parseInt(storeId));    
    const productTypes = store?.product_types.map(type => type.name) || [];
 
    useEffect(() => {
        const token = cookies.get("login_token");
        if (!token) {
            navigate('/login');
        } else if (!isStoreConnected) {
            navigate('/connectstore2');
        }
    }, [isStoreConnected, navigate]);

    useEffect(() => {
        getTemplateList();
    }, []);

    const getTemplateList = async () => {
        try {
            const data = { user_id: userId, store_id: storeId, product_types: productTypes };
            const response = await axios.post(`${apiUrl}/templates/get_standard_templates_matching_store_product_types`, data);
            console.log('Template List: ', response.data);
            setTemplateList(response.data);
            setFilteredTemplates(response.data);
        } catch (err) {
            console.log('err: ', err);
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setEditorContent(template.template_content);
        setCurrentStep(2);

        // Set the product type from the template if not already selected
        if (!selectedProductType) {
            setSelectedProductType(template.template_product_type);
        }
    };

    const handleSaveTemplate = async () => {
        if (!templateName) {
            showAlert("Template name is required", "error");
            return;
        }

        const data = {
            user_id: userId,
            store_id: storeId,
            template_name: templateName, 
            product_type: selectedProductType,           
            product_description_text: editorContent
        };
        try {
            const response = await axios.post(`${apiUrl}/templates/save_user_template`, data);
            showAlert(response.data.message || "Template saved successfully", "success");
            navigate('/template');
        } catch (err) {
            console.log('err: ', err);
            const errorMessage = err.response && err.response.data ? err.response.data.error : "Something went wrong";
            showAlert(errorMessage, "error");
        }
    };

    const handleProductTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedProductType(selectedType);

        // Remove the filtering logic
        // const filtered = templateList.filter(template => template.template_product_type === selectedType);
        // setFilteredTemplates(filtered);
    };

    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold mb-4'>Create Template</h2>
            <div className='flex mb-4 border-b-2 border-gray-300'>
                <div
                    className={`flex-1 text-center py-2 cursor-pointer ${currentStep === 1 ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'text-gray-500'}`}
                    onClick={() => setCurrentStep(1)}
                >
                    Step 1: Select Standard Template
                </div>
                <div
                    className={`flex-1 text-center py-2 cursor-pointer ${currentStep === 2 ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'text-gray-500'}`}
                    onClick={() => setCurrentStep(2)}
                >
                    Step 2: Customize Template
                </div>
                <div
                    className={`flex-1 text-center py-2 cursor-pointer ${currentStep === 3 ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'text-gray-500'}`}
                    onClick={() => setCurrentStep(3)}
                >
                    Step 3: Save Template
                </div>
            </div>
            {currentStep === 1 && (
                <div className='relative w-full h-full flex flex-col items-center'>
                    <div className='flex items-center mb-4'>
                        <label htmlFor="productType" className='bg-gray-200 p-1 rounded mr-2'>
                            Product Type:
                        </label>
                        <select
                            id="productType"
                            value={selectedProductType}
                            onChange={handleProductTypeChange}
                            className='p-2 border rounded'
                        >
                            <option value="">--Select Product Type--</option>
                            {productTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex space-x-4 w-[80%] justify-center'>
                        {templateList.map((template) => (
                            <div key={template.template_id} className='min-w-[300px] p-4 rounded-lg shadow-lg bg-white' onClick={() => handleTemplateSelect(template)}>
                                <div className='font-bold'>{template.template_name}</div>
                                <div className='text-sm text-gray-500'>{template.template_product_type}</div>
                                <div className='border p-2 rounded' style={{ height: '200px', overflowY: 'auto' }}>
                                    <ReactQuill value={template.template_content} readOnly={true} theme="bubble" style={{ height: '100%', overflow: 'hidden' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setCurrentStep(1)} className='absolute right-0 p-2 bg-gray-300 rounded-full hover:bg-gray-400'>
                        <FaChevronRight size={24} />
                    </button>
                </div>
            )}
            {currentStep === 2 && selectedTemplate && (
                <div className='w-full h-full'>
                    <div className='mb-4'>
                        <strong>Selected Product Type: </strong>
                        {selectedProductType ? selectedProductType : "No product type was selected"}
                    </div>
                    <ReactQuill value={editorContent} onChange={setEditorContent} />
                    <button onClick={() => setCurrentStep(3)} className='mt-4 bg-blue-500 text-white py-2 px-4 rounded'>Proceed to Save</button>
                </div>
            )}
            {currentStep === 3 && (
                <div className='w-full h-full flex flex-col'>
                    <div className='mb-4'>
                        <strong>Selected Product Type: </strong>
                        {selectedProductType ? selectedProductType : "No product type was selected"}
                    </div>
                    <h3 className='text-xl font-bold mb-4'>Preview and Save Template</h3>
                    <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                        className='mb-4 p-2 border rounded'
                    />
                    <button onClick={handleSaveTemplate} className='mb-4 bg-blue-500 text-white py-2 px-4 rounded'>Save Template</button>
                    <div className='border p-4 rounded bg-gray-50 mb-4'>
                        <h4 className='text-lg font-semibold mb-2'>Template Preview:</h4>
                        <ReactQuill value={editorContent} readOnly={true} theme="bubble" />
                    </div>
                </div>
            )}
        </div>
    );
} 