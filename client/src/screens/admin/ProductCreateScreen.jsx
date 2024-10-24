import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../slices/categoriesApiSlice';
import { toast } from 'react-toastify';
import Compressor from 'compressorjs';

export default function ProductCreateScreen() {
    const navigate = useNavigate();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const { data: categories, isLoading: loadingCategories, error } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (!loadingCategories && categories && categories.length > 0) {
            setCategory(categories[0]?._id || '');
        }
    }, [loadingCategories, categories]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !image || !brand || !category || !description || countInStock <= 0) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            await createProduct({
                name,
                image,
                brand,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Product Created');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    const createCategoryHandler = async () => {
        if (newCategoryName.trim()) {
            try {
                const newCategory = await createCategory({ name: newCategoryName }).unwrap();
                setCategory(newCategory._id);
                toast.success('Category Created');
                setNewCategoryName('');
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        }
    };

    const deleteCategoryHandler = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId).unwrap();
                toast.success('Category Deleted');
                // Refresh the category list or update state
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1048576) { // 1MB size limit
                alert("File is too large. Please select a file smaller than 1MB.");
                return;
            }
            
            new Compressor(file, {
                quality: 0.8,
                maxWidth: 800,
                success: (compressedResult) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result); // Convert to Base64
                    };
                    reader.readAsDataURL(compressedResult);
                },
                error: (err) => {
                    console.error(err);
                    toast.error('Image compression failed.');
                }
            });
        }
    };

    if (loadingCategories) {
        return <div>Loading Categories...</div>;
    }

    if (error) {
        return <div>Error loading categories</div>;
    }

    return (
        <div className="w-1/3 mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-medium">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
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
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
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
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="category" className="block font-medium">
                        Category:
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        required
                    >
                        {categories && categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex mt-2">
                        <input
                            type="text"
                            placeholder="New Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight flex-grow"
                        />
                        <button
                            type="button"
                            className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2"
                            onClick={createCategoryHandler}
                        >
                            Add Category
                        </button>
                    </div>
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
                        onChange={(e) => setCountInStock(Number(e.target.value))}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
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
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-4"
                        disabled={loadingCreate}
                    >
                        {loadingCreate ? 'Creating...' : 'Create Product'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-800 text-white py-2.5 px-4 rounded-md"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}
