// src/screens/SearchScreen.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice'; // Use the query from your Redux slice
import Spinner from '../components/Spinner';
import Product from '../components/Product';

const SearchScreen = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || ''; // Get keyword from query params

    const { data: products, isLoading, error } = useGetProductsQuery({ keyword }); // Use the keyword to fetch products

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="container">
            <div className="content-wrapper justify-start">
                <h2 className="text-2xl font-semibold mb-4">Search Results for "{keyword}"</h2>
            </div>
            <div className="content-menu grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))
                ) : (
                    <p>No products found for "{keyword}".</p>
                )}
            </div>
        </div>
    );
};

export default SearchScreen;