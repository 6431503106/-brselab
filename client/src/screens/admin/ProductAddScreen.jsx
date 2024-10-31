import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useCreateProductMutation, useUploadFileHandlerMutation } from '../../slices/productsApiSlice';
import { useNavigate } from 'react-router-dom';

export default function ProductAddScreen() {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        image: '',
        brand: '',
        category: '',
        countInStock: 0,
        description: ''
    });

    const { name, image, brand, category, countInStock, description } = productData;
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [uploadProductImage, { isLoading: uploadLoading }] = useUploadFileHandlerMutation();

    const handleInputChange = e => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', image);
            await uploadProductImage(formData).unwrap();
            await createProduct({ name, image, brand, category, countInStock, description }).unwrap();
            toast.success("Product Created");
            navigate("/admin/products"); // นำทางไปยังหน้า ProductListScreen
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    };

    const handleFileChange = async e => {
        const file = e.target.files[0];
        setProductData({
            ...productData,
            image: file
        });
    };

    return (
        <div className='w-1/3 mx-auto'>
            <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-medium">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block font-medium">
                        Image:
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept='image/*'
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="brand" className="block font-medium">
                        Brand:
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={brand}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block font-medium">
                        Category:
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="countInStock" className="block font-medium">
                        Count In Stock:
                    </label>
                    <input
                        type="number"
                        id="countInStock"
                        name="countInStock"
                        value={countInStock}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-medium">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Add Product
                    </button>
                    {loadingCreate && <Spinner />}
                    {uploadLoading && <Spinner />}
                </div>
            </form>
        </div>
        
    )
}
