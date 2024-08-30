/*import React from 'react'
import { useDeliverOrderMutation } from '../slices/orderApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { useGetOrderDetailsQuery } from '../slices/orderApiSlice'
*/

import { toast } from "react-toastify";

export default function OrderScreen() {
    toast.error('Deleted this page navigate /profile')
}
    /*const navigate = useNavigate()
    const { id: orderId } = useParams()
    const { userInfo } = useSelector(state => state.user)
    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId)
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

    if (error) {
        return toast.error(error.message)
    }

    if (isLoading) {
        return <Spinner />
    }


    const { shippingAddress, user, isDelivered, orderItems, shippingPrice, taxPrice } = order

    const calculateTotal = orderItems => {
        return orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
    }

    const handleCancel = () => {
        // ยกเลิกการกรอกข้อมูลและกลับไปยังหน้าหลักหรือหน้าก่อนหน้านี้
        navigate("/admin/orders")
    }
    const deliverOrderHandler = async (orderId) => {
        await deliverOrder(orderId)
        refetch()
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-2/3 p-4">
                <h2 className="text-3xl font-semibold mb-4">Details</h2>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Request ID:</h3>
                    <p>{orderId}</p>
                </div>
                <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Request Date:</h3>
                <p>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Information:</h3>
                    <p>Username: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Reason: {shippingAddress.reason}</p>
                    <p>Borrow Date: {new Date(shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                    <p>Return Date: {new Date(shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                </div>
                <div className="mb-4">

                    <h3 className="text-lg font-semibold mb-2">Status:</h3>
                    <p className={isDelivered ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{isDelivered ? "Confirmed" : "Not Confirm"}</p>
                    
                </div>
            </div>

            <div className="md:w-1/3 bg-gray-100 p-4">
                <h3 className="text-xl font-semibold mb-4">Summary</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left">Product</th>
                            <th className="text-right">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems?.map(item => (
                            <tr key={item._id} className="border-b border-gray-400">
                                <td className='px-7 py-3 whitespace-nowrap'>
                                <img src={item.image} alt={item.name} className="w-20 h-15 object-cover mr-4" />
                                <td className="text-left">{item.name}</td></td>
                                <td className="text-right">{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <div className="flex justify-between">
                {userInfo.isAdmin && !order.isDelivered && <button
                    className="bg-green-800 text-white px-4 py-2 rounded-md mt-4 hover:bg-gray-950"
                    onClick={() => deliverOrderHandler(orderId)}
                >
                    Confirm
                </button>}
                <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-2 hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            Back
                </button>
                </div>
                {<Spinner />}
            </div>
        </div >
    )
}*/