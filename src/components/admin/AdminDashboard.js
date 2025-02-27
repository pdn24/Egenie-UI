import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

function AdminDashboard() {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleLogout = () => {
        cookies.remove('login_token');
        cookies.remove('user_role');
        navigate('/admin/login');
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button onClick={() => navigate('/admin/template')}>Template</button>
            <button onClick={() => navigate('/admin/account-info')}>Account Info</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminDashboard; 