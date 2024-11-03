import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { openModal } from "../../store/slices/modalSlice.ts";



const Navbar: React.FC = () => {
    const dispatch = useDispatch();

    const handleSignUpClick = () => {
        dispatch(openModal({type: 'signup'}));
    }

    const handleLogInClick = () => {
        dispatch(openModal({type: 'login'}));
    }


    return (
        // <header className="bg-stone-400 w-screen px-2 py-2">
        //     <nav className="flex items-center justify-between">
        //         <NavLink className="" to="/">Survivor Fantasy League</NavLink>
        //         <ul className="flex space-x-4 items-center justify-end">
        //             <li>
        //                 <NavLink to="/survivor-cast">Survivor Cast</NavLink>
        //             </li>
        //             <li>
        //             <button
        //                     onClick={handleLogInClick}
        //                     className="text-white hover:text-blue-600"
        //                 >Log In</button>
        //             </li>
        //             <li>
        //                 <button
        //                     onClick={handleSignUpClick}
        //                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        //                 >Sign Up</button>
        //             </li>
        //         </ul>
        //     </nav>
        // </header>
        <header className="nav-bar">
            {/* Navbar Flex Container */}
            <nav className="flex items-center justify-between">

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
                {/* Auth Buttons Flex container */}
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
            </nav>
        </header>
    )
}

export default Navbar;