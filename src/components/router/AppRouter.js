import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import "../../index.css";

import { Cookies } from 'react-cookie';
import Sidebar from '../Sidebar';
import Home2 from '../screens/Home2';
import ConnectStore2 from '../screens/ConnectStore2';
import AcceptConnection from '../screens/AcceptConnection';
import StoreConnected from '../screens/StoreConnected';
import Store from '../screens/ProductDescription/Store';
import Template from '../screens/ProductDescription/Template';
import BulkFormat from '../screens/ProductDescription/BulkFormat';
import AccountInfo from '../screens/Profile/AccountInfo';
import LoginSecurity from '../screens/Profile/LoginSecurity';
import PlanBilling from '../screens/Profile/PlanBilling';
import UserAndPermissions from '../screens/Setting/UserAndPermissions';
import AddStaff from '../screens/Setting/AddStaff';
import Home from '../Home';
import PageNotFound from '../utils/PageNotFound';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ResetPassword from '../screens/Profile/ResetPassword';

function AppRouter() {
    const cookies = new Cookies();
    const token = cookies.get('login_token');
    const location = useLocation();
   
    const pathsWithSidebar = [
        '/home2', '/connectstore2', '/storeconnected',
        '/store', '/template', '/bulkformat', '/accountinfo', '/Accountinfo',
        '/loginsecurity', '/planbilling', '/userandpermission', '/addstaff'
    ]; 

    const showSidebar = token && pathsWithSidebar.includes(location.pathname);

    return (
        <div className={`flex lg:flex-row flex-col w-full h-screen ${token ? 'overflow-hidden' : ""}`}>
            <div className='sticky top-0 z-20 lg:h-full'>
                {showSidebar && <Sidebar />}
            </div>
            <div className={`w-full h-full ${token ? 'overflow-hidden' : ""}`}>
                <Routes>
                    {/* <Route path='/connectstore' element={<ConnectStore />} /> */}
                    <Route path='/home2' element={<Home2 />} />
                    <Route path='/connectstore2' element={<ConnectStore2 />} />
                    <Route path='/connect' element={<AcceptConnection />} />
                    <Route path='/storeconnected' element={<StoreConnected />} />
                    <Route path='/store' element={<Store />} />
                    <Route path='/template' element={<Template />} />
                    <Route path='/bulkformat' element={<BulkFormat />} />
                    <Route path='/accountinfo' element={<AccountInfo />} />
                    <Route path='/loginsecurity' element={<LoginSecurity />} />
                    <Route path='/planbilling' element={<PlanBilling />} />
                    <Route path='/userandpermission' element={<UserAndPermissions />} />
                    <Route path='/addstaff' element={<AddStaff />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path={`/user/reset_password/:token`} element={<ResetPassword />} />
                    <Route path='*' element={<PageNotFound />} />
                </Routes>
            </div>
        </div>
    );
}

export default AppRouter;
