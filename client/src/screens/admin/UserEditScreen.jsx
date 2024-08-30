import React, { useEffect, useState } from 'react'
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../slices/userApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'

export default function UserEditScreen() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { data: user } = useGetUserByIdQuery(id)
    const [updateUser, { isLoading }, refetch] = useUpdateUserMutation()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)

    const handleUpdateUser = async () => {
        try {
            const res = await updateUser({ name, email, isAdmin, id })
            toast.success(res.message);
            // Navigate with state to trigger refetch and pass success message
            navigate("/admin/users", { state: { refetch: true, message: res.message } })
        } catch (error) {
            toast.error(error?.data?.message || error?.error)
        }
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
    }, [user])

    return (
        <div className="content-wrapper flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold my-4">Edit User</h2>
            <form className="w-full max-w-sm" onSubmit={handleUpdateUser}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="isAdmin" className="block text-gray-700 font-bold">
                        Is Admin
                    </label>
                    <input
                        type="checkbox"
                        id="isAdmin"
                        checked={isAdmin}
                        onChange={e => setIsAdmin(e.target.checked)}
                        className="mr-2"
                    />
                </div>
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-4"
                    onClick={handleUpdateUser}
                >
                    Update
                </button>
                
                <Link to="/admin/users" className="bg-gray-800 text-white py-2.5 px-4 rounded-md mb-4">
                Back
                </Link>

                {isLoading && <Spinner />}
            </form>
        </div>
    )
}
