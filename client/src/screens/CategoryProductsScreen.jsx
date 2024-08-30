import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice'; // Import the categories query
import Spinner from '../components/Spinner';
import Product from '../components/Product';

const CategoryProductsScreen = () => {
    const { categoryId } = useParams();
    const { data: products, isLoading, error } = useGetProductsQuery({ keyword: '', categoryId });
    const { data: categories } = useGetCategoriesQuery(); // Fetch categories

    const selectedCategory = categories?.find(category => category._id === categoryId); // Find the selected category by ID

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="container">
            <div className="content-wrapper justify-start">
                <h2 className="text-2xl font-semibold mb-4">Products in {selectedCategory?.name}</h2> {/* Display the category name */}
            </div>
            <div className="content-menu grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products?.map(product => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default CategoryProductsScreen;
