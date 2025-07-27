import React, { useState, useRef, useEffect } from 'react';
import './UserDropdown.css'; // Make sure this is linked

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        alert('خروج کلیک شد!'); // Replace with actual logout logic
        setIsOpen(false);
    };

    return (
        <div className={`user-dropdown-container ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            {/* Header section - visible always */}
            <div className="user-dropdown-header" onClick={toggleDropdown}>
                <span className="user-dropdown-icon user-icon">
                    {/* User icon SVG */}
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3874 16.1875V14.6458C16.3874 13.8281 16.0626 13.0438 15.4843 12.4656C14.9061 11.8874 14.1218 11.5625 13.3041 11.5625H7.13741C6.31966 11.5625 5.5354 11.8874 4.95716 12.4656C4.37893 13.0438 4.05408 13.8281 4.05408 14.6458V16.1875" stroke="#00BA9F" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.2207 8.47917C11.9235 8.47917 13.304 7.09871 13.304 5.39583C13.304 3.69296 11.9235 2.3125 10.2207 2.3125C8.51778 2.3125 7.13733 3.69296 7.13733 5.39583C7.13733 7.09871 8.51778 8.47917 10.2207 8.47917Z" stroke="#00BA9F" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </span>
                <span className="user-dropdown-text">مهمان</span>
                <span className="user-dropdown-icon caret-icon">
                    {/* Caret icon SVG - changes based on isOpen */}
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 15L12 8L19 15" stroke="#38b2ac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 9L12 16L19 9" stroke="#38b2ac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </span>
            </div>

            {/* Dropdown menu - conditionally rendered */}
            {isOpen && (
                <div className="user-dropdown-menu">
                    <div className="user-dropdown-divider"></div>
                    <div className="user-dropdown-item" onClick={handleLogout}>
                        <span className="user-dropdown-icon logout-icon">
                            {/* Logout icon SVG */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 16L21 12M21 12L17 8M21 12H9M13 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H13" stroke="#38b2ac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="user-dropdown-text">خروج</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;