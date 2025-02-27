import { Dropdown } from "flowbite-react";
import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/css/BulkFormat.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import axios from "axios";
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/userInfoContext";
import { showAlert } from "../../utils/AlertService";

export default function Template() {
    const cookies = new Cookies();
    const userId = cookies.get('user_id');
    const navigate = useNavigate();
    const { isStoreConnected, userdata } = useContext(UserContext);   
    const [templateList, setTemplateList] = useState([]);
    const [productTypeList, setproductTypeList] = useState([]);
    const [productTypeLabel, setProductTypeLabel] = useState('Select Product Type');
    const [templateLabel, setTemplateLabel] = useState('Select Existing Template');   
    const [loading, setLoading] = useState(false);
    const [editorContent, setEditorContent] = useState(''); // State for Quill editor content
    const [isEditable, setIsEditable] = useState(false); // Add state for isEditable
    const apiUrl = process.env.REACT_APP_API_URL;
    const storeId = localStorage.getItem('active_store_id');    
    const { user_info: userInfo } = useContext(UserContext); // Assuming user_info is available in UserContext

    console.log('Template - userdata object:', userdata);
    // Extract broad product categories from userdata
    const broadCategories = userdata?.stores?.[0]?.broad_product_categories_ai_generated || [];

    useEffect(() => {
        const token = cookies.get("login_token");
        if (!token) {
            navigate('/login');
        } else if (!isStoreConnected) {
            navigate('/connectstore2');
        }
    }, [isStoreConnected, navigate]);


    const handleSaveTemplate = async () => {

        const templateName = prompt("Please enter the template name:");
        if (!templateName) {
            showAlert("Template name is required", "error");
            return;
        }

        const data = {
            user_id: userId,
            store_id: storeId,
            template_name: templateName,
            product_description_text: editorContent // Use the state for editor content
        };
        try {
            const response = await axios.post(`${apiUrl}/templates/save_user_template`, data);
            showAlert(response.data.message || "Template saved successfully", "success");
            await getTemplateList(); // Reload the template list dropdown
        } catch (err) {
            console.log('err: ', err);
            const errorMessage = err.response && err.response.data ? err.response.data.error : "Something went wrong";
            showAlert(errorMessage, "error");
        }
        
    };

    const handleEditTemplate = async (templateId) => {  
        const confirmEdit = await new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="fixed inset-0 flex items-center justify-center z-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg helvetica">
                        <h2 class="text-lg font-bold mb-4 helvetica">Do you really want to modify the template changes?</h2>
                        <div class="flex justify-end gap-4">
                            <button id="confirmYes" class="bg-black text-white py-1 px-4 rounded-3xl helvetica">Yes</button>
                            <button id="confirmNo" class="bg-gray-500 text-white py-1 px-4 rounded-3xl helvetica">Discard</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const confirmYesButton = document.getElementById('confirmYes');
            const confirmNoButton = document.getElementById('confirmNo');

            if (confirmYesButton && confirmNoButton) {
                confirmYesButton.onclick = () => {
                    resolve(true);
                    document.body.removeChild(modal);
                };
                confirmNoButton.onclick = () => {
                    resolve(false);
                    document.body.removeChild(modal);
                };
            } else {
                console.error("Modal buttons not found");
                resolve(false);
                document.body.removeChild(modal);
            }
        });

        if (confirmEdit) {
            const data = {
                user_id: userId,
                store_id: storeId,
                template_id: templateId,
                product_description_text: editorContent // Use the state for editor content
            };
            try {
                const response = await axios.post(`${apiUrl}/templates/edit_template`, data);
                showAlert(response.data.message || "Template updated successfully", "success");
                await getTemplateList(); // Reload the template list dropdown
            } catch (err) {
                console.log('err: ', err);
                const errorMessage = err.response && err.response.data ? err.response.data.error : "Something went wrong";
                showAlert(errorMessage, "error");
            }
        } else {
            showAlert("Template modification discarded", "info");
        }
    };

    const getTemplateList = async () => {
        try {
            setLoading(true);
            const data = {
                user_id: userId,
                store_id: storeId              
            };
            const response = await axios.post(`${apiUrl}/templates/get_user_templates`, data);

            // Assuming the response data is directly the templates array
            const templates = response.data;

            // Map the response to match the expected state structure
            const formattedTemplates = templates.map(template => ({
                template_id: template.template_id,
                template_name: template.template_name,
                product_description_text: template.product_description_text_format 
            }));

            setTemplateList(formattedTemplates);
            setLoading(false);
        } catch (err) {
            console.log('err: ', err);
            setLoading(false);
        }
    };

    const getProductTypeList= async () => {
        try {          
            const response = await axios.post(`${apiUrl}/shopify/get_product_types`, {                 
                user_id: userId,
                store_id: storeId
            });
            setproductTypeList(response.data.product_types);
        } catch (err) {
            console.log('err: ', err);
        }
    }; 

    useEffect(() => {
        getProductTypeList();
        getTemplateList();       
    }, []);


    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold mb-4'>Template</h2>
            <div className='w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 rounded-xl'>
                <div className="w-full relative">
                    <div className='flex items-center justify-start'>
                        <div className='w-full flex flex-col items-start gap-4'>
                            <div className='w-full max-w-[800px]'>
                                <div className='templateDropdown flex items-center justify-start gap-2'>
                                    <label className='sm:text-base text-sm'>Choose existing template to modify:</label>
                                    <div className='relative'>
                                        <Dropdown label={templateLabel} className='option-height'>
                                            {templateList.map((template) => (
                                                <Dropdown.Item key={template.template_id} onClick={() => {
                                                    setTemplateLabel(template.template_name);
                                                    setEditorContent(template.product_description_text);
                                                }}>
                                                    {template.template_name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown>
                                    </div>
                                    <div className='ml-4'>
                                        <button className='w-[100px] h-[40px] bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 hover:text-white hover:border hover:border-indigo-500 ease-in-out duration-700' onClick={() => navigate('/generateTemplate')}>Generate</button>
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    {/* Quill Editor */}
                                    <ReactQuill value={editorContent} onChange={setEditorContent} />
                                </div>
                            </div>
                            <div className='flex items-center gap-4 mt-4'>
                                <button className='w-[100px] h-[40px] bg-black text-white rounded-full font-bold hover:bg-white hover:text-black hover:border hover:border-black ease-in-out duration-700' onClick={() => handleSaveTemplate(templateList.find(template => template.template_name === templateLabel)?.template_id)}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
