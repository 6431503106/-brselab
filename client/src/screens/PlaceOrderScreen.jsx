/*import React from 'react'
import { useCreateOrderMutation } from "../slices/orderApiSlice"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { clearCartItems } from '../slices/cartSlice'

export default function PlaceOrderScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    const { cartItems, borrowingInformation: { deliveryTime, borrowingDate, returnDate, reason } } = cart

    const [createOrder, { isLoading }] = useCreateOrderMutation()

    const handleCancel = () => {
        // ยกเลิกการกรอกข้อมูลและกลับไปยังหน้าหลักหรือหน้าก่อนหน้านี้
        navigate("/cart")
    }

    const handlePlaceOrder = async () => {
        try {
            const res = await createOrder({
                orderItems: cartItems,
                borrowingInformation: { deliveryTime, borrowingDate, reason },
            }).unwrap()
            dispatch(clearCartItems())
            toast.success("Order Placed!")
            navigate(`/order/${res._id}`)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-2/3 p-4">
                <h2 className="text-2xl font-semibold mb-4">Information</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Reason:</h3>
                    <p>{reason}</p>
                    <h3 className="text-lg font-semibold mb-2">Borrowing Date:</h3>
                    <p>{borrowingDate}</p>
                   <h3 className="text-lg font-semibold mb-2">Return Date:</h3>
<p>{returnDate ? returnDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</p>
                </div>
            </div>

            <div className="md:w-1/3 bg-gray-100 p-4">
                <h3 className="text-xl font-semibold mb-4">Product Summary</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left">Product</th>
                            <th className="text-right">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item._id} className="border-b border-gray-400">
                                <td className='px-7 py-3 whitespace-nowrap'>
                                    <img src={item.image} alt={item.name} className="w-20 h-15 object-cover mr-4" />
                                    <span className="text-left">{item.name}</span>
                                </td>
                                <td className="text-right">{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between">
                    <button
                        className="bg-green-800 text-white px-4 py-2 rounded-md mt-4 hover:bg-gray-950"
                        onClick={handlePlaceOrder}>Confirm
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-2 hover:bg-gray-400"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
                {isLoading && <Spinner />}
            </div>
        </div>
    )
}*/
