import React, { useState } from 'react';

export default function UserAddScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleAddUser = () => {
        // นำข้อมูลไปที่ API หรือทำการจัดเก็บข้อมูลตามที่คุณต้องการ
        // เช่นเรียกใช้ API เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์
        // หรือทำการเก็บข้อมูลไว้ในส่วนของ state หรือ context ของแอปพลิเคชัน
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Is Admin:", isAdmin);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold my-4">Add User</h2>
            <form className="w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="mr-2"
                    />
                </div>
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={handleAddUser}
                >
                    Add
                </button>
            </form>
        </div>
    );
}
