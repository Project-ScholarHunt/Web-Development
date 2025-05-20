import React from 'react'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="pt-17">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout