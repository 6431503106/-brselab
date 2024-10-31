import React from 'react';
import { Link } from 'react-router-dom';
import '../Header.css'; // Add CSS file

export default function Product({ product }) {
    return (
        <Link
            to={`/product/${product._id}`}
            state={{ refetch: true }}  // Add refetch flag here
        >
            <div className="bg-white p-4 shadow-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
            <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-3 rounded-t-md"
                />
                <div className="p-3">
                    <h2 className="text-lg font-bold text-gray-800 truncate hover:text-gray-600 ">
                        {product.name}
                    </h2>
                    {product.category && (
                        <p className="text-sm text-gray-500 mt-1">
                            Category: <span className="font-medium text-gray-700">{product.category.name}</span>
                        </p>
                    )}
                    <p className={`mt-2 text-sm ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.countInStock > 0 ? `Available: ${product.countInStock}` : 'Unavailable'}
                    </p>
               <div className="flex items-center mb-4">
                            <span className="text-yellow-500 text-lg mr-2">&#9733;</span>
                            <span className="text-gray-600">{product.rating} ({product.numReviews} reviews)</span>
                        </div>
            </div>
            </div>
        </Link>
    );
}
