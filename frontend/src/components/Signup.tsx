import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/slices/authSlice";
import { RootState, AppDispatch } from "../store/store";

const Signup: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, isAuthenticated, user } = useSelector((state : RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch(signupUser({email,password,username}));
    }

    return (
        <div>
            <h2>Create an account</h2>
            {isAuthenticated && user ? (
                <p>Welcome, {user.username}!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Sign up'}</button>
                </form>
            )}

            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    );
}

export default Signup;