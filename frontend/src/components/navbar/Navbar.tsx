import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { openModal } from "../../store/slices/modalSlice.ts";
import { RootState } from "../../store/store.ts";



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
        <header className="nav-bar">
            {/* Navbar Flex Container */}
            <nav className="flex items-end justify-between">

                {/* Links Flex Container - */}
                <div className="flex space-x-10 items-end justify-between">
                    <NavLink className="title" to="/">Survivor Fantasy League</NavLink>
                    <ul className="flex space-x-4 items-center justify-center">
                        <li>
                            <NavLink to="/" className="link-button">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/survivor-cast" className="link-button">Survivor Cast</NavLink>
                        </li>
                    </ul>
                </div>
                {!isAuthenticated &&
                    <ul className="flex space-x-4 items-center justify-end">
                        <li>
                            <button
                                onClick={handleLogInClick}
                                className="login-logout-button"
                            >Log In</button>
                        </li>
                        <li>
                            <button
                                onClick={handleSignUpClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >Sign Up</button>
                        </li>
                    </ul>
                }
                {isAuthenticated &&
                    <div className="flex items-end justify-end">
                        <button
                            onClick={handleLogOutClick}
                            className="login-logout-button"
                        >Log Out</button>
                    </div>
                }
                {/* Auth Buttons Flex container */}
            </nav>
        </header>
    )
}

export default Navbar;