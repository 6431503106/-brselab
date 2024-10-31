import React, { useState } from 'react';
import { useAddMutation } from '../../slices/userApiSlice';
import { toast } from 'react-toastify';
import { setCredentials } from '../../slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; 

export default function AddScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [add, { isLoading: isAddLoading }] = useAddMutation();

    const handleAdd = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await add({ name, email, password }).unwrap();
            dispatch(setCredentials(res));
            toast.success("User added successfully");
            navigate("/admin/users");
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8 mb-28 p-4 max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleAdd}>
                <div className="mb-4">
                    <label htmlFor="name" className="text-gray-700">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type='submit'
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-blue-600"
                    disabled={isLoading || isAddLoading}
                >
                    {isLoading || isAddLoading ? 'Adding...' : 'Add New User'}
                </button>
                <Link to="/admin/users" className="bg-gray-800 text-white py-2.5 px-4 rounded-md mb-4">
                    Back
                </Link>
            </form>
        </div>
    );
}
