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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // Sidebar state

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
    return utcPlus7Date.toISOString();
  };

  const hasFreeItems = cartItems.some(item => item.category === "66cca9155fa68b084904d0d1");
  const hasNonFreeItems = cartItems.some(item => item.category !== "66cca9155fa68b084904d0d1");

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
    if (hasNonFreeItems && !returnDate) {
      toast.error("Please select a return date for non-Free items.");
      return;
    }

    try {
      const borrowingDateInUTCPlus7 = convertToUTCPlus7(borrowingDate);
      const returnDateInUTCPlus7 = hasNonFreeItems ? convertToUTCPlus7(returnDate) : null;

      const orderItems = cartItems.map(item => ({
        ...item,
        itemId: uuidv4(),
        borrowingDate: borrowingDateInUTCPlus7,
        returnDate: item.category === "66cca9155fa68b084904d0d1" ? null : returnDateInUTCPlus7,
        reason,
      }));

      const orderData = { orderItems };

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
          navigate("/profile2");
        }
      });

      setReason("");
      setBorrowingDate("");
      setReturnDate("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const categories = {
    "66cca9155fa68b084904d0d1": "Free",
    "66cca9325fa68b084904d0d6": "Item",
    // เพิ่ม categoryId อื่น ๆ ตามต้องการ
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className={`content-wrapper ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="w-full max-w-6xl flex flex-col md:flex-row">
          
          {/* Left Section: Cart Items */}
          <div className="md:w-2/4 p-6 bg-white ">
            <div className="ml-1">
              <Link to="/">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                  Back
                </button>
              </Link>
            </div>

            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartItems.map(item => (
                  <div className="bg-gray-30 shadow-md rounded-lg p-4 flex" key={item._id}>
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Category: <span className="font-medium">{categories[item.category] || item.category}</span></p>
                      <p className="text-gray-600 text-sm">Quantity: {item.qty}</p>
                      <button
                        className="mt-2 text-red-600 text-sm hover:text-red-800 transition duration-200"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
          </div>

          {/* Right Section: Borrowing Information */}
          <div className=" mt-8 mb-28 p-4 max-w-md">
          <div>
            <h2 className="text-xl font-semibold">Total Items: {totalItems}</h2>
          </div>
          <h3 className="text-xl font-semibold mt-2">Borrowing Information</h3>
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

            {/* Only show return date if there are non-free items */}
            {hasNonFreeItems && (
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
            )}

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
    </div>
  );
}
