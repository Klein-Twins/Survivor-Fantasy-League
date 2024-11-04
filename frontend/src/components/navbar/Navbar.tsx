import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { openModal } from "../../store/slices/modalSlice";
import { RootState } from "../../store/store";

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleSignUpClick = () => {
        dispatch(openModal({ type: 'signup' }));
    }

    const handleLogInClick = () => {
        dispatch(openModal({ type: 'login' }));
    }

    const handleLogOutClick = () => {
        dispatch(openModal({ type: 'logout' }));
    }

    return (
        <header className="p-4 bg-gray-100 shadow-md">
            <nav className="flex flex-col md:flex-row items-center justify-between">
                {/* Title and Links */}
                <div className="flex flex-col md:flex-row items-center space-x-8">
                    <NavLink className="title text-lg font-semibold text-blue-700" to="/">Survivor Fantasy League</NavLink>
                    <ul className="flex space-x-4">
                        <li>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => 
                                    isActive ? "link-button text-blue-500 font-semibold" : "link-button"
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/survivor-cast" 
                                className={({ isActive }) => 
                                    isActive ? "link-button text-blue-500 font-semibold" : "link-button"
                                }
                            >
                                Survivor Cast
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Auth Buttons */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                    {!isAuthenticated ? (
                        <>
                            <button
                                onClick={handleLogInClick}
                                className="text-blue-700 hover:text-blue-900"
                            >
                                Log In
                            </button>
                            <button
                                onClick={handleSignUpClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogOutClick}
                            className="text-red-500 hover:text-red-700"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;