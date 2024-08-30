import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserOrdersQuery } from '../slices/orderApiSlice';
import { useUpdateUserProfileMutation } from '../slices/userApiSlice';
import { useUpdateOrderItemStatusMutation } from '../slices/orderApiSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { setCredentials } from '../slices/userSlice';
import Modal from 'react-modal';
import { AiOutlineMore } from "react-icons/ai";
import TablePagination from '@mui/material/TablePagination';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [keyword, setKeyword] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const { data: userOrders, isLoading, error, refetch } = useGetUserOrdersQuery();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
    const [updateOrderStatus] = useUpdateOrderItemStatusMutation();

    useEffect(() => {
        if (userOrders) {
            handleSearchFilter();
        }
    }, [keyword, userOrders]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filtered = userOrders.flatMap(order =>
            order.orderItems.filter(item =>
                item.name.toLowerCase().includes(searchValue) || item._id.toLowerCase().includes(searchValue)
            ).map(item => ({
                ...item,
                order: order
            }))
        );
        setFilteredOrders(filtered);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const indexOfLastItem = (page + 1) * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const paginatedOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handleUpdateProfile = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await updateUser({ _id: userInfo._id, name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Updated Profile");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedItem) {
            toast.error('Please select an order and item.');
            return;
        }

        try {
            await updateOrderStatus({
                orderId: selectedOrder._id,
                itemId: selectedItem._id,
                status: "Cancel"
            });
            toast.success(`Status updated to Cancel`);
            refetch();
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openModal = (order, item) => {
        setSelectedOrder(order);
        setSelectedItem(item);
        setIsOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsOpen(false);
    };

    return (
        <div className="content-wrapper flex">
            {/* Profile Information */}
            <div className="w-1/3 p-4">
                <h1 className="text-xl font-semibold mb-4">Profile</h1>
                <form className="mb-6" onSubmit={handleUpdateProfile}>
                    {/* Input fields for name, email, password, and confirm password */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="border p-2 w-full rounded-md"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="border p-2 w-full rounded-md"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="border p-2 w-full rounded-md"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="border p-2 w-full rounded-md"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {/* Button to update profile */}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                        Update Profile
                    </button>
                    {isUpdating && <Spinner />}
                </form>
            </div>
            
        </div>
    );
}
