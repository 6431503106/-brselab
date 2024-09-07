import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

export default function CartScreen() {
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  const [reason, setReason] = useState("");
  const [borrowingDate, setBorrowingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const totalItems = cartItems.reduce((acc, item) => acc + +item.qty, 0);

  const handleDeleteItem = id => {
    dispatch(removeFromCart(id));
  };

  const convertToUTCPlus7 = (dateString) => {
    const date = new Date(dateString);
    const utcPlus7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours
    return utcPlus7Date.toISOString();  // Convert to ISO string for consistent backend processing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!reason) {
      toast.error("Please provide a reason.");
      return;
    }
    if (!borrowingDate) {
      toast.error("Please select a borrowing date.");
      return;
    }
    if (!returnDate) {
      toast.error("Please select a return date.");
      return;
    }
  
    try {
      // Convert dates to UTC+7
      const borrowingDateInUTCPlus7 = convertToUTCPlus7(borrowingDate);
      const returnDateInUTCPlus7 = convertToUTCPlus7(returnDate);

      // Construct borrowing and return information per item
      const orderItems = cartItems.map(item => ({
        ...item,
        itemId: uuidv4(),  // Create unique item IDs
        borrowingDate: borrowingDateInUTCPlus7,  // Convert to UTC+7
        returnDate: returnDateInUTCPlus7,        // Convert to UTC+7
        reason,                                  // Use the entered reason
      }));

      const orderData = {
        orderItems,        // Pass the constructed order items with borrowing/return info
      };
  
      await createOrder(orderData).unwrap();
  
      dispatch(clearCartItems());
  
      Swal.fire({
        title: "Request Submitted",
        html: "Your request is being processed...",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          navigate("/profile2"); // Redirect to profile
        }
      });
  
      // Clear the form fields after submission
      setReason("");
      setBorrowingDate("");
      setReturnDate("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col md:flex-row items-start mx-auto">
      <div className="md:w-2/4 p-4">
        <div className='content-menu justify-start '>
          <Link to={'/'}>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4">Back</button>
          </Link>
        </div>
        {cartItems.length !== 0 ?
          <div className="content-wrapper grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartItems.map(item => (
              <div className='border border-gray-300 p-4 flex items-center' key={item._id}>
                <div>
                  <img src={item.image} alt={item.name} className='w-16 h-16 object-contain mr-4' />
                  <h3 className='text-lg font-semibold'>{item.name}</h3>
                  <p className='text-gray-600'>Quantity: {item.qty}</p>
                  <button className='text-red-500 hover:text-red-700' onClick={() => handleDeleteItem(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div> : (
            <p className='content-wrapper text-gray-400 text-xl justify-start'>Your cart is empty.</p>
          )}
      </div>

      <div className='content-table'>
        <div className="container mx-auto mt-8 mb-28 p-4 max-w-md">
          <div>
            <h2 className="text-xl font-semibold">Total Items: {totalItems}</h2>
          </div>
          <h3 className="text-xl font-semibold">Borrowing Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="reason" className="text-gray-700">
                Reason:
              </label>
              <input
                type="text"
                id="reason"
                className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                placeholder="Enter your reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="borrowingDate" className="text-gray-700">
                Borrowing Date: MM/DD/YY
              </label>
              <input
                type="date"
                id="borrowingDate"
                className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full uppercase"
                value={borrowingDate}
                onChange={e => setBorrowingDate(e.target.value)}
                min={today}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="returnDate" className="text-gray-700">
                Return Date: MM/DD/YY
              </label>
              <input
                type="date"
                id="returnDate"
                className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full uppercase"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                min={borrowingDate || today}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={isLoading}  // Disable the button while loading
              >
                {isLoading ? "Processing..." : "Submit Request"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}