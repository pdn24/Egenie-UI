import { Dropdown, Modal, Button } from "flowbite-react"
import React, { useContext, useEffect, useState, useRef } from 'react'
import '../../assets/css/BulkFormat.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import axios from "axios"
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"
import UserContext from "../../context/userInfoContext"
import { showAlert } from "../utils/AlertService"


export default function AdminGenerateTemplate() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id');
    const navigate = useNavigate();
   
    const [productCatgeoryList, setProductCatgeoryList] = useState([]);
    const [productCatgeoryLabel, setProductCategoryLabel] = useState('Select Product Category');
    const [productCategoryId, setProductCategoryId] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [productType, setProductType] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [isTemplateGenerated, setIsTemplateGenerated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempTemplateName, setTempTemplateName] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const token = cookies.get("login_token");
        if (!token) {
            navigate('/login');
        } 
    }, [navigate]);

    const getProductCategoryList = async () => {
        try {
            const response = await axios.get(`${apiUrl}/products/get_product_categories`);
            console.log('API Response:', response.data); // Debugging line
            setProductCatgeoryList(response.data || []); // Directly use response.data
        } catch (err) {
            console.log('err: ', err);
            setProductCatgeoryList([]);
        }
    };

    useEffect(() => {
        getProductCategoryList();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        const data = {
            user_id: userId,
            product_category: productCatgeoryLabel,
            product_type: productType
        };
        try {
            const response = await axios.post(`${apiUrl}/templates/generate_template_suggestions`, data);
            setEditorContent(response.data.template_suggestion || "");
            setIsTemplateGenerated(true);
        } catch (err) {
            console.log('err: ', err);
            showAlert(err.response.data.error || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setIsModalOpen(true);        
    };

    const handleModalSave = async () => {
       
        const data = {
            category_id: productCategoryId,
            setting_name: tempTemplateName,
            product_type: productType,
            product_description_text: editorContent,
            request_type: isEdit ? 'edit' : 'save'
        };

        try {
            const response = await axios.post(
                `${apiUrl}/templates/${isEdit ? 'edit_template' : 'save_formatting_template'}`,
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.error) {
                showAlert(response.data.error, "error");
            } else {
                setTemplateName(tempTemplateName);
                showAlert(isEdit ? "Template updated successfully!" : "Template saved successfully!", "success");
                setIsModalOpen(false);       
            }
            if (isTemplateGenerated && tempTemplateName) {            
                setIsEdit(true);           
            }    
        } catch (err) {
            console.log('err: ', err);
            showAlert(err.response?.data.error || "Something went wrong", "error");
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setTempTemplateName('');
    };



    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold mb-4'>Generate Template</h2>
            <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 rounded-xl'>
                <div className="w-full relative">
                    <div className='flex items-center justify-start'>
                        <div className='w-full flex flex-col items-start gap-4'>
                            <div className='w-full max-w-[800px]'>
                                {templateName && <h3 className='text-lg font-bold mb-2'>Template Name: {templateName}</h3>}
                                <div className='templateDropdown flex items-center justify-start gap-2'>
                                    <label className='sm:text-base text-sm'>Product Category:</label>
                                    <div className='relative'>
                                        <Dropdown label={productCatgeoryLabel} className='option-height'>
                                            {productCatgeoryList.length > 0 ? (
                                                productCatgeoryList.map((productCategory, index) => (
                                                    <Dropdown.Item key={index} onClick={() => {
                                                        setProductCategoryLabel(productCategory.category_name);
                                                        setProductCategoryId(productCategory.category_id);
                                                        setEditorContent('');
                                                        setIsTemplateGenerated(false);
                                                        setTemplateName('');
                                                        setProductType('');
                                                        setIsEdit(false);
                                                        setTempTemplateName('');
                                                    }}>
                                                        {productCategory.category_name}
                                                    </Dropdown.Item>
                                                ))
                                            ) : (
                                                <Dropdown.Item disabled>No categories available</Dropdown.Item>
                                            )}
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className='templateDropdown flex items-center justify-start gap-2 mt-4'>
                                    <label className='sm:text-base text-sm'>Product Type:</label>
                                    <div className='relative'>
                                        <input 
                                            type="text" 
                                            value={productType} 
                                            onChange={(e) => {
                                                setProductType(e.target.value);
                                                setTemplateName('');
                                                setTempTemplateName('');
                                            }} 
                                            className='option-height border border-gray-300 rounded-md p-2'
                                            placeholder='Enter Product Type'
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <ReactQuill value={editorContent} onChange={(content) => {
                                        setEditorContent(content);                                       
                                    }} />
                                </div>
                            </div>
                            <div className='flex items-center gap-4 mt-4'>
                                <button 
                                    className={`w-[100px] h-[40px] bg-black text-white rounded-full font-bold hover:bg-white hover:text-black hover:border hover:border-black ease-in-out duration-700`} 
                                    onClick={handleGenerate}
                                >
                                    Generate
                                </button>
                                {isTemplateGenerated && (
                                    <button 
                                        className={`w-[100px] h-[40px] bg-blue-500 text-white rounded-full font-bold hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 ease-in-out duration-700`} 
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                show={isModalOpen} 
                onClose={handleModalCancel}              
            >
                <Modal.Header className="text-lg font-bold text-center py-4">
                    {isEdit ? "Template name already exists. Do you want to overwrite?" : "Enter Template Name"}
                </Modal.Header>
                <Modal.Body className="px-6 py-4">
                    <input
                        type="text"
                        value={tempTemplateName}
                        onChange={(e) => setTempTemplateName(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        placeholder='Enter Template Name'
                    />
                </Modal.Body>
                <Modal.Footer className="flex justify-end gap-2 px-6 py-4">
                    <button 
                        onClick={handleModalSave} 
                        className="w-[100px] h-[40px] bg-blue-500 text-white rounded-full font-bold hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 ease-in-out duration-700"
                    >
                        {isEdit ? "Yes" : "Save"}
                    </button>
                    <button 
                        onClick={handleModalCancel} 
                        className="w-[100px] h-[40px] bg-gray-300 text-black rounded-full font-bold hover:bg-white hover:text-black hover:border hover:border-gray-500 ease-in-out duration-700"
                    >
                        {isEdit ? "No" : "Cancel"}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
