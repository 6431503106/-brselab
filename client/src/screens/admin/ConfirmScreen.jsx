import React, { useState, useEffect } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useGetOrdersQuery, useUpdateOrderItemStatusMutation, useDeleteOrderItemMutation } from '../../slices/orderApiSlice';
import { useGetUsersQuery } from '../../slices/userApiSlice';
import Modal from 'react-modal';
import TablePagination from '@mui/material/TablePagination';
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineMore } from "react-icons/ai";
import Swal from 'sweetalert2';

Modal.setAppElement('#root');

export default function OrderListScreen() {
  const [keyword, setKeyword] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();
  const [updateOrderStatus] = useUpdateOrderItemStatusMutation();
  const [deleteOrderItem] = useDeleteOrderItemMutation();

  useEffect(() => {
    if (!isLoading && orders) {
      handleSearchFilter();
    }
  }, [keyword, orders]);

  useEffect(() => {
    if (!isLoading && users) {
      handleSearchFilter();
    }
  }, [keyword, users]);

  useEffect(() => {
    paginate(0);
  }, [filteredUsers]);

  const handleSearchFilter = () => {
    const searchValue = keyword.toLowerCase();
    const filtered = orders.flatMap(order =>
      order.orderItems
        .filter(item =>
          item.name.toLowerCase().includes(searchValue) ||  // Filter by product name
          item._id.toLowerCase().includes(searchValue) ||   // Filter by item ID
          order.user?.name.toLowerCase().includes(searchValue) // Filter by user name
        )
        .filter(item => item.status === 'Confirm') // Only include Pending items
        .map(item => ({
          ...item,
          order: order // Attach the order to each item
        }))
    );
    setFilteredOrders(filtered);
  };

  const paginate = pageNumber => setPage(pageNumber);

  // Pagination handling
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !selectedItem) {
        toast.error('Please select an order and item.');
        return;
    }

    try {
        const response = await updateOrderStatus({
            orderId: selectedOrder._id,
            itemId: selectedItem._id,
            status: "Borrowing"
        });

        if (response.status === 400) {
            toast.error('Not enough stock to confirm the order');
        } else {
            toast.success('Status updated to Borrowing');
            refetch();
            closeModal(); 
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    }
};


  const handleUpdateStatusCancel = async () => {
    if (!selectedOrder || !selectedItem) {
      toast.error('Please select an order and item.');
      return;
    }

    try {
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

  const handleUpdateStatusNotable = async () => {
    if (!selectedOrder || !selectedItem) {
      toast.error('Please select an order and item.');
      return;
    }

    try {
      const promise = updateOrderStatus({
        orderId: selectedOrder._id,
        itemId: selectedItem._id,
        status: "Non-returnable",
      });

      await toast.promise(promise, {
        pending: "Updating status...",
        success: {
          render: () => {
            refetch(); 
            closeModal(); 
            return `Status updated to Non-returnable`;
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

  const handleDeleteOrderItem = async (orderId, itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrderItem({ orderId, itemId });
          toast.success('Item deleted successfully');
          refetch();
        } catch (error) {
          toast.error(error.message);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
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

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastUser = (page + 1) * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <div className="content-wrapper justify-start">
        <h2 className="text-3xl font-semibold mb-3">Confirmed Lists</h2>
      </div>
      <div className="content-menu flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..User name, Product"
            className="border border-gray-300 p-2 rounded-lg shadow-sm w-full md:w-60"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button
            onClick={handleSearchFilter}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>
      <div className="content-table ">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Product Name</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">User Name</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Request Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Borrow Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Return Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Status</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(item => (
              <tr key={`${item.order._id}-${item._id}`} className='text-center'>
                <td className='px-7 py-3 whitespace-nowrap border'>{item.name}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{item.order.user?.name}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>
        {new Date(item.order.createdAt).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })}
      </td>
      <td className='px-7 py-3 whitespace-nowrap border'>
        {item.borrowingDate
          ? new Date(item.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })
          : 'N/A'}
      </td>
      <td className='px-7 py-3 whitespace-nowrap border'>
        {item.returnDate
          ? new Date(item.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })
          : '-'}
      </td>
      <td className={`px-7 py-3 whitespace-nowrap border ${item.status === 'Confirm' ? 'text-green-500' : ''}`}>{item.status}</td>
      <td className='px-7 py-3 whitespace-nowrap border'>
        <button className='py-2 px-2 whitespace-nowrap' onClick={() => openModal(item.order, item)}>
          <AiOutlineMore />
        </button>
        <button
          className='text-black rounded-md px-3 py-1 mx-1 hover:bg-red-700'
          onClick={() => handleDeleteOrderItem(item.order._id, item.itemId)}
        >
          <MdOutlineDelete />
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
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
            width: '80%',
            maxWidth: '1000px'
          }
        }}
      >
        {selectedOrder && selectedItem && (
          <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-2/4 p-4">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <strong><span className="font-semibold">Item Name:</span> {selectedItem.name}</strong>
        <p><span className="font-semibold">Order ID:</span> {selectedOrder._id}</p>
        <p><span className="font-semibold">User Name:</span> {selectedOrder.user?.name}</p>
        <p><span className="font-semibold">Borrow Date:</span> {selectedItem.borrowingDate ? new Date(selectedItem.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
        <p><span className="font-semibold">Return Date:</span> {selectedItem.returnDate ? new Date(selectedItem.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
        <p><span className="font-semibold">Reason:</span> {selectedItem.reason || 'N/A'}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                   className="bg-blue-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded  whitespace-nowrap"
                >
                  Already taken it
                </button>
                <button
                  onClick={handleUpdateStatusNotable}
                   className="bg-green-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded  whitespace-nowrap"
                >
                  Non-returnable
                </button>
                {selectedItem.status !== 'Cancel' && selectedItem.status !== 'Return' && selectedItem.status !== 'Borrowing' && selectedItem.status !== 'Non-returnable' ? (
                  <button
                    onClick={handleUpdateStatusCancel}
                     className="bg-red-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded  whitespace-nowrap"
                  >
                    Cancel Request
                  </button>
                ) : null}
              </div>
            </div>
            <div className="md:w-2/4 bg-gray-100 p-5 mt-5 rounded-md" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <table className="w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="text-left px-10">Product</th>
                    <th className="text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder && selectedItem && (
                    <tr key={selectedItem._id} className="border-b border-gray-400">
                      <td className='px-7 py-3 whitespace-nowrap'>
                        <img src={selectedItem.image} alt={selectedItem.name} className="w-20 h-15 object-cover mr-4" />
                        <span className="text-center px-3">{selectedItem.name}</span>
                      </td>
                      <td className="text-center">{selectedItem.qty}</td>
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
