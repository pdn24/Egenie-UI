import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='mt-5'>
            <div className='border-t-2 text-center helvetica py-4'>
                <p>Copyright © Egenie. All rights reserved.</p>
                <Link to='/admin/login' className='text-blue-500 underline font-narrow'>Egenie Admin Login </Link>
            </div>
        </div>
    );
}

export default Footer;