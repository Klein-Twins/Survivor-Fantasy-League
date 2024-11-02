import { useState } from "react";

import { signup } from "../api/authHttp";
export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleSubmit = async (e) => {
      setError();
      setSuccess();
      e.preventDefault();

      if(password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {

          const userData = { email, username, password };
          const response = await signup(userData);
          console.log('User created successfully:', response);
          setSuccess(true);
          // Handle successful signup (e.g., redirect or show a message)
      } catch (err) {
          setError(err.message || 'An error occurred during signup');
      }
  };
  
    return (
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-b to-slate-800 from-yellow-500 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">User Created!</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Enter your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Enter your Username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="blocktext-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="blocktext-sm font-bold mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
}