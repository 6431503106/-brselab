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
import classNames from 'classnames';

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
    const [selectedStatus, setSelectedStatus] = useState("All");
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
    }, [keyword, selectedStatus, userOrders]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filtered = userOrders.flatMap(order =>
            order.orderItems.filter(item =>
                (item.name.toLowerCase().includes(searchValue) || item._id.toLowerCase().includes(searchValue)) &&
                (selectedStatus === "All" || item.status === selectedStatus)
            ).map(item => ({
                ...item,
                order: order
            }))
        );
        filtered.sort((a, b) => {
            const statusComparison = (b.order.status === 'confirm') - (a.order.status === 'confirm');
            if (statusComparison !== 0) return statusComparison;
            return new Date(b.order.createdAt) - new Date(a.order.createdAt);
        });
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
          // Create a promise for updating the order status
          const promise = updateOrderStatus({
            orderId: selectedOrder._id,
            itemId: selectedItem._id,
            status: "Cancel",
          });
      
          await toast.promise(promise, {
            pending: "Updating status...",
            success: {
              render: () => {
                refetch(); 
                closeModal(); 
                return `Status updated to Cancel`;
              },
            },
            error: {
              render({ data }) {
                return data.message || "Failed to update status.";
              },
            },
          });
        } catch (error) {
          toast.error("An unexpected error occurred.");
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'Confirm':
                return 'bg-green-200 text-green-800';
            case 'Borrowing':
                return 'bg-blue-200 text-blue-800';
            case 'Cancel':
                return 'bg-red-200 text-red-800';
            case 'Return':
                return 'bg-gray-200 text-gray-800';
            case 'Non-returnable':
                return 'bg-orange-200 text-orange-800';
            default:
                return '';
        }
    };

    return (
        <div >
            <div className="content-wrapper justify-start ">
            <h2 className="text-3xl font-semibold mb-3">My Borrowing Lists</h2>
            </div>
            
            <div className="content-menu mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="User name,Product"
                        className="border border-gray-300 p-2 rounded-lg shadow-sm w-full md:w-60"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                    <button
                        onClick={handleSearchFilter}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                        Search
                    </button>
                </div>
                <div>
                    <select
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg shadow-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirm">Confirm</option>
                        <option value="Borrowing">Borrowing</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Return">Return</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                </div>
            </div>

            <div className="content-table overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                    <thead>
                        <tr>
                            {/*<th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">ID</th>*/}
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Product Name</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Quantity</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Borrow Date</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Return Date</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Status</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {paginatedOrders.map(item => (
                            <tr key={`${item.order._id}-${item._id}`} className="my-4">
                                {/*<td className='px-7 py-3 whitespace-nowrap border text-center '>{item.order._id.slice(-3)}</td>*/}
                                <td className='px-7 py-3 text-center border'>{item.name}</td>
                                <td className='px-7 py-3 whitespace-nowrap text-center border '>{item.qty}</td>
                                <td className='px-7 py-3 whitespace-nowrap text-center border'>
                                    {new Date(item.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })}
                                </td>
                                <td className='px-7 py-3 whitespace-nowrap text-center border'>
                {item.returnDate
                    ? new Date(item.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })
                    : item.returnedDate 
                    ? new Date(item.returnedDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })
                    : "-"}
                    
                </td>
                                <td className={`text-center px-7 py-3  text-center whitespace-nowrap  ${getStatusClass(item.status)}`}>{item.status}</td>
                                <td className='text-back-500 text-center '>
                                    <button className='py-2 px-10 whitespace-nowrap' onClick={() => openModal(item.order, item)}>
                                    <AiOutlineMore />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className='text-gray-400 text-xl text-center'>No items in your list</td>
                            </tr>
                            )}
                    </tbody>
                </table>

                {/* Pagination Component */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>

            {/* Modal for Order Details */}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Order Details Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: '8px'
                    }
                }}
            >
                {selectedOrder && selectedItem && (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-white p-5 rounded-md shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                            <strong className="block mb-2"><span className="font-semibold">Item Name:</span> {selectedItem.name}</strong>
                            <p className="mb-2"><span className="font-semibold">User:</span> {selectedOrder.user?.name}</p>
                            <p className="mb-2"><span className="font-semibold">Status:</span> {selectedItem.status}</p>
                            <p><span className="font-semibold">Borrow Date:</span> {selectedItem.borrowingDate ? new Date(selectedItem.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
                            <p><span className="font-semibold">Returned Date:</span> {selectedItem.returnedDate ? new Date(selectedItem.returnedDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'You not returned this Item'}</p>
                            <p><span className="font-semibold">Reason:</span> {selectedItem.reason || 'N/A'}</p>
                            <div className="mt-4">
                                {selectedItem.status !== 'Cancel' && selectedItem.status !== 'Confirm' && selectedItem.status !== 'Return' && selectedItem.status !== 'Borrowing' && selectedItem.status !== 'Non-returnable' ? (
                                    <button
                                        onClick={handleUpdateStatus}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Cancel Request
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        <div className="md:w-2/3 bg-gray-100 p-5 mt-5 md:mt-0 rounded-md shadow-md overflow-y-auto">
                            <h3 className="text-xl font-semibold mb-4">Summary</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="text-left px-6 py-2">Product</th>
                                        <th className="text-center px-6 py-2">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItem && (
                                        <tr key={selectedItem._id} className="border-b border-gray-300">
                                            <td className='px-6 py-3 whitespace-nowrap flex items-center'>
                                                <img src={selectedItem.image} alt={selectedItem.name} className="w-20 h-15 object-cover mr-4" />
                                                <span>{selectedItem.name}</span>
                                            </td>
                                            <td className="text-center px-6 py-3">{selectedItem.qty}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
