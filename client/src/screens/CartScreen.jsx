import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { v4 as uuidv4 } from 'uuid';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

export default function CartScreen() {
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  const { borrowingInformation } = cart;
  const [reason, setReason] = useState(borrowingInformation?.address || "");
  const [borrowingDate, setBorrowingDate] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const totalItems = cartItems.reduce((acc, item) => acc + +item.qty, 0);
  const { data: products } = useGetProductsQuery(); // Fetch products

  const handleDeleteItem = id => {
    dispatch(removeFromCart(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!reason) {
      toast.error("Please provide your reason.");
      return;
    }
    if (!borrowingDate) {
      toast.error("Please provide borrowing date.");
      return;
    }
  
    try {
      // Convert borrowingDate to UTC+7
      const borrowingDateObject = new Date(borrowingDate);
      const borrowingDateInUTCPlus7 = new Date(borrowingDateObject.getTime() + 0);
  
      // Calculate returnDate by adding 7 days to adjusted borrowingDate
      const returnDate = new Date(borrowingDateInUTCPlus7);
      returnDate.setDate(returnDate.getDate() + 7);
  
      const borrowingInformationData = {
        reason,
        borrowingDate: borrowingDateInUTCPlus7.toISOString(),
        returnDate: returnDate.toISOString(),
      };
  
      const res = await createOrder({
        orderItems: cartItems.map(item => ({
          ...item,
          // Keep the existing itemId rather than creating a new one
          itemId: uuidv4, // Assuming _id is used as itemId
        })),
        borrowingInformation: borrowingInformationData,
      }).unwrap();
  
      dispatch(clearCartItems());
  
      Swal.fire({
        title: "In Progress",
        html: "Please wait...",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
  
      // Clear the input fields
      setReason("");
      setBorrowingDate("");
      navigate("/profile2");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col md:flex-row  items-start mx-auto">
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
            <p className='content-wrapper text-gray-400 text-xl justify-start'>Your Cart is empty.</p>
          )}
      </div>

      <div className='content-table'>
        <div className="container mx-auto mt-8 mb-28 p-4 max-w-md">
        <div>
          <h2 className="text-xl font-semibold">Total: {totalItems}</h2>
        </div>
          <h3 className="text-xl font-semibold">Information</h3>
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
                Borrowing Date: Month/Day/Year
              </label>
              <input
                type="date"
                id="borrowingDate"
                className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full uppercase"
                value={borrowingDate}
                onChange={e => setBorrowingDate(e.target.value)}
                min={today} // Restrict selection to today or future dates
              />
            </div>

            <div className="mb-4">
              <label htmlFor="returnDate" className="text-gray-700">
                Return Date: Month/Day/Year
              </label>
              <p>
                {borrowingDate
                  ? new Date(new Date(borrowingDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('us', { month: '2-digit', day: '2-digit', year: 'numeric' })
                  : ''}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Continue
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
  )
}