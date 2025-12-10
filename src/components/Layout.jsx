import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
    return (
        <div style={{ paddingBottom: '80px' }}> {/* Add padding to prevent content being hidden behind nav */}
            <Outlet />
            <BottomNav />
        </div>
    );
};

export default Layout;
