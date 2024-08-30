import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveBorrowingInformation } from "../slices/cartSlice"

    
export default function ShippingScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { borrowingInformation } = cart
    const [address, setAddress] = useState(borrowingInformation?.address || "")
    const [city, setCity] = useState(borrowingInformation?.city || "")
    const [postalCode, setPostalCode] = useState(borrowingInformation?.postalCode || "")
    const [country, setCountry] = useState(borrowingInformation?.country || "")
    const [deliveryTime, setDeliveryTime] = useState("");

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(saveBorrowingInformation({ address, city, postalCode, country, deliveryTime }))
        navigate("/place-order")
    }

    const handleCancel = () => {
        // ยกเลิกการกรอกข้อมูลและกลับไปยังหน้าหลักหรือหน้าก่อนหน้านี้
        navigate("/cart")
    }

    return (
        <div className="container mx-auto mt-8 mb-28 p-4 max-w-md ">
            <h3 className="text-3xl font-semibold mb-4">Information</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="address" className="text-gray-700">
                        Reason:
                    </label>
                    <input
                        type="text"
                        id="address"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        placeholder="Enter your address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="deliveryTime" className="text-gray-700">
                        Return Date:
                    </label>
                    <input
                        type="date"
                        id="deliveryTime"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        value={deliveryTime}
                        onChange={e => setDeliveryTime(e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-6000"
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
