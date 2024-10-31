import React from 'react';

export default function Footer({ isSidebarOpen }) {
    return (
        <footer className={`footer-wrapper  text-white py-3 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            <div className="container mx-auto text-center">
                <p className='text-sm'> For SE &copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
