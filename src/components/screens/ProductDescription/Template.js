import { Dropdown, Modal } from 'flowbite-react';
import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/css/BulkFormat.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import axios from "axios";
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/userInfoContext";
import { showAlert } from "../../utils/AlertService";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons for edit, delete, and navigation


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
    const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index
    const [selectedTemplateId, setSelectedTemplateId] = useState(null); // State to track selected template ID
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);

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

    const getTemplateList = async () => {
        try {
            console.log('User ID:', userId);
            console.log('Store ID:', storeId);
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
            console.log('Formatted Templates added to map:', formattedTemplates);
            setTemplateList(formattedTemplates);
            setLoading(false);
        } catch (err) {
            console.log('err: ', err);
            setLoading(false);
        }
    };

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
            product_description_text: editorContent, // Use the state for editor content
            request_type: 'save'
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
                template_id: editingTemplate.template_id,
                template_content: editorContent // Use the state for editor content
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

    const handleDeleteTemplate = (templateId) => {
        setTemplateToDelete(templateId);
        setIsDeleteModalOpen(true); // Open the confirmation modal
    };

    const confirmDeleteTemplate = async () => {
        if (!templateToDelete) return;

        const data = {
            user_id: userId,
            template_id: templateToDelete
        };

        try {
            const response = await axios.post(`${apiUrl}/templates/delete_template`, data);
            showAlert(response.data.message || "Template deleted successfully", "success");
            await getTemplateList(); // Reload the template list after deletion
        } catch (err) {
            console.log('err: ', err);
            const errorMessage = err.response && err.response.data ? err.response.data.error : "Something went wrong";
            showAlert(errorMessage, "error");
        } finally {
            setIsDeleteModalOpen(false); // Close the modal
            setTemplateToDelete(null); // Reset the template to delete
        }
    };

    const handleTemplateClick = async (templateId) => {
        const selectedTemplate = templateList.find(template => template.template_id === templateId);
        if (selectedTemplate) {
            setEditingTemplate(selectedTemplate);
            setEditorContent(selectedTemplate.product_description_text); // Set editor content
            setIsPopupOpen(true);
        }       
    };

    const handleModifyClick = async () => {
        setIsConfirmModalOpen(true); // Open the confirmation modal
    };

    const handleConfirmEdit = async () => {
        try {
            const data = {
                user_id: userId,
                store_id: storeId,
                template_id: editingTemplate.template_id,
                template_content: editorContent,
                request_type: 'edit' // Use the state for editor content
            };
            const response = await axios.post(`${apiUrl}/templates/edit_template`, data);
            showAlert(response.data.message || "Template updated successfully", "success");
            await getTemplateList(); // Reload the template list dropdown
            setIsPopupOpen(false); // Close the popup after successful edit
        } catch (err) {
            console.log('err: ', err);
            const errorMessage = err.response && err.response.data ? err.response.data.error : "Something went wrong";
            showAlert(errorMessage, "error");
        }
        setIsConfirmModalOpen(false); // Close the confirmation modal
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < templateList.length - 3 ? prevIndex + 1 : templateList.length - 3));
    };

    const handleTemplateSelect = (templateId) => {
        setSelectedTemplateId(templateId);
        setTemplateLabel(templateList.find(template => template.template_id === templateId)?.template_name || 'Select Existing Template');
        
        // Ensure the selected template is visible in the carousel
        const selectedIndex = templateList.findIndex(template => template.template_id === templateId);
        if (selectedIndex >= 0) {
            setCurrentIndex(Math.max(0, Math.min(selectedIndex, templateList.length - 3)));
        }
    };

    return (
        <div className='bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col'>
            <h2 className='xl:text-[32px] text-2xl font-bold mb-4'>Template</h2>
            <div className='flex items-center mb-4'>
                <input type='text' placeholder='Search templates...' className='p-2 border rounded mr-4' />
               
                <div className='templateDropdown flex items-center justify-start gap-2'>                  
                    <div className='relative'>
                        <Dropdown label={templateLabel} className='option-height'>
                            {templateList.map((template) => (
                                <Dropdown.Item key={template.template_id} onClick={() => handleTemplateSelect(template.template_id)}>
                                    {template.template_name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>                   
                    {templateList.length > 0 && (
                        <button 
                            className='ml-4 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 hover:text-white hover:border hover:border-indigo-500 ease-in-out duration-700 py-3 px-6 text-lg'
                            onClick={() => navigate('/createTemplate')}
                        >
                            Create Template
                        </button>
                    )}
                </div>
            </div>
            {templateList.length > 0 ? (
                <div className='relative w-full h-full flex justify-center items-center'>
                    <button onClick={handlePrev} className='absolute left-0 p-2 bg-gray-300 rounded-full hover:bg-gray-400'>
                        <FaChevronLeft size={24} />
                    </button>
                    <div className='flex space-x-4 w-[80%] justify-center'>
                        {templateList.slice(currentIndex, currentIndex + 3).map((template) => (
                            <div key={template.template_id} 
                                 className={`min-w-[300px] p-4 rounded-lg shadow-lg ${template.template_id === selectedTemplateId ? 'border-4 border-gray-800 bg-gray-300' : 'bg-white'}`}
                                 onClick={() => handleTemplateClick(template.template_id)}>
                                <div className='flex justify-between items-center mb-2'>
                                    <div className='font-bold'>{template.template_name}</div>
                                    <div className='flex space-x-2'>
                                        <FaEdit className='cursor-pointer text-blue-500' onClick={(e) => { e.stopPropagation(); handleTemplateClick(template.template_id); }} />
                                        <FaTrash className='cursor-pointer text-red-500' onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.template_id); }} />
                                    </div>
                                </div>
                                <div className='border p-2 rounded' style={{ height: '200px', overflowY: 'auto' }}>
                                    <ReactQuill
                                        value={template.product_description_text}
                                        readOnly={true}
                                        theme="bubble"
                                        style={{ height: '100%', overflow: 'hidden' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleNext} className='absolute right-0 p-2 bg-gray-300 rounded-full hover:bg-gray-400'>
                        <FaChevronRight size={24} />
                    </button>
                </div>
            ) : (
                <div className='flex justify-center items-center h-full flex-col'>
                    <p className='text-lg font-semibold'>No templates available. Please create a new template.</p>
                    <div>
                        <button className='mt-4 w-[200px] h-[40px] bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 hover:text-white hover:border hover:border-indigo-500 ease-in-out duration-700 self-center' onClick={() => navigate('/createTemplate')}>Create New Template</button>
                    </div>
                </div>
            )}

            

            {isPopupOpen && editingTemplate && (
                <Modal show={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>
                        Edit Template: {editingTemplate.template_name}
                    </Modal.Header>
                    <Modal.Body>
                        <ReactQuill
                            value={editorContent}
                            onChange={setEditorContent}
                            theme="snow"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleModifyClick} className='bg-blue-500 text-white py-2 px-4 rounded'>
                            Modify
                        </button>
                    </Modal.Footer>
                </Modal>
            )}

            {isConfirmModalOpen && (
                <Modal show={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
                    <Modal.Header>
                        Confirm Modification
                    </Modal.Header>
                    <Modal.Body>
                        Do you really want to modify existing template {editingTemplate.template_name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleConfirmEdit} className='bg-blue-500 text-white py-2 px-4 rounded'>
                            Yes
                        </button>
                        <button onClick={() => setIsConfirmModalOpen(false)} className='bg-gray-500 text-white py-2 px-4 rounded'>
                            No
                        </button>
                    </Modal.Footer>
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <Modal.Header>
                        Confirm Deletion
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this template?
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={confirmDeleteTemplate} className='bg-red-500 text-white py-2 px-4 rounded'>
                            Yes, Delete
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className='bg-gray-500 text-white py-2 px-4 rounded'>
                            Cancel
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
