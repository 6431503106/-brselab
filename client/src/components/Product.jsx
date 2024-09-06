import React from 'react';
import { Link } from 'react-router-dom';
import '../Header.css'; // Add CSS file
export default function Product({ product }) {
    return (
        <Link
            to={`/product/${product._id}`}
            state={{ refetch: true }}  // Add refetch flag here
        >
            <div className="bg-white p-4 shadow-md rounded-md cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-48 object-contain mb-2" />
                <h2 className="text-lg font-semibold product-name">
                    {product.name}
                </h2>
                <p className="text-gray-700 mt-2">
                    {product.countInStock > 0 ? `Available: ${product.countInStock}` : 'Unavailable'}
                </p>
                <div className="flex items-center mt-1">
                    <span className="text-yellow-500 mr-1">{product.rating}</span>
                    <span className="text-gray-500">({product.numReviews} reviews)</span>
                </div>
            </div>
        </Link>
    );
}
