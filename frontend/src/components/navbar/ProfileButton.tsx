import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ProfileButtonProps {
    onLogoutClick : () => void,

}

const ProfileButton: React.FC<ProfileButtonProps> = ({onLogoutClick}: ProfileButtonProps) => {
    
    const account = useSelector((state: RootState) => state.auth.account);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        onLogoutClick();
    }
    
    return (
        <div className="relative">
            {/* Profile image button */}
            <button onClick={handleProfileClick} className="rounded-full w-12 h-12 overflow-hidden border-2 border-gray-300">
                {/* Replace the src with the actual profile image URL */}
                <img src="https://via.placeholder.com/150" alt="Profile" className="w-full h-full object-cover" />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <div
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-2">
                        <p className="px-4 py-2 text-lg text-center text-gray-700">{account?.userName}</p>
                        <button
                            onClick={handleLogoutClick}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 focus:outline-none"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileButton;