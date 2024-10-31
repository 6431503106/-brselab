import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCreateReviewMutation, useGetProductDetailsQuery } from '../slices/productsApiSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addToCart } from '../slices/cartSlice';
import '../Header.css'; // Add CSS file

export default function ProductScreen() {
    const { id: productId } = useParams();
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const [createReview, { isLoading: LoadingCreateReview }] = useCreateReviewMutation();
    const [qty, setQty] = useState(1);
    const [userComment, setUserComment] = useState("");
    const [userRating, setUserRating] = useState(5);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        if (state?.refetch) {
            refetch();  // Trigger refetch to update products list
        }
        if (state?.refetchProductId === productId) {
            refetch();  // Trigger refetch to update product details
        }
        if (state?.refetchHome) {
            // Optionally handle home page refetch or notifications
        }
    }, [state, refetch]);

    if (isLoading) return <Spinner />;
    if (error) {
        toast.error(error?.data?.message || error?.error);
        return null;
    }

    const addtoCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };
    const categories = {
        "66cca9155fa68b084904d0d1": "Free",
        "66cca9325fa68b084904d0d6": "Item",
        "66ccafc05fa68b084904d145": "Book",
        // เพิ่ม categoryId อื่น ๆ ตามต้องการ
      };

    const handleCreateReview = async (e) => {
        e.preventDefault();
        try {
            const res = await createReview({ productId, rating: userRating, comment: userComment }).unwrap();
            refetch();
            toast.success(res.message);
            setUserComment("");
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    };

    return (
        <div className="content-wrapper">
            {isLoading ? (<Spinner />) : error ? toast.error(error?.data?.message || error?.error) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-1">
                        <img style={{ width: '500px', height: '500px' }} src={product.image} alt={product.name} className="w-full h-auto" />
                    </div>
                    <div className="md:col-span-1">
                        <h1 className="text-2xl font-semibold">{product.name}</h1>
                        <p className="text-gray-700 mt-2">{product.description}</p>
                        <div className="flex items-center mb-4">
                            <span className="text-yellow-500 text-lg mr-2">&#9733;</span>
                            <span className="text-gray-600">{product.rating}({product.numReviews} reviews)</span>
                        </div>
                    <p className="text-gray-600 mb-4">
                        Category: <span className="font-semibold">{categories[product.category] || product.category}</span>
                    </p>
                    <p className="text-gray-600 mb-4">
                        {product.countInStock > 0 ? (
                            <span className="text-green-600">In Stock: {product.countInStock}</span>
                        ) : (
                            <span className="text-red-600">Out of Stock</span>
                        )}
                    </p>
                    {product.countInStock > 0 && (
                        <div className="mb-4">
                            <label htmlFor="quantity" className="text-gray-700 font-semibold">
                                Quantity:
                            </label>
                            <select
                                id="quantity"
                                className="bg-white border border-gray-300 p-2 rounded-md mt-2"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                            >
                                {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="justify-between">
                            {product.countInStock > 0 ? (
                                <button
                                    className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded-md mt-4 hover:bg-yellow-600"
                                    onClick={addtoCartHandler}
                                >
                                    Add To Cart
                                </button>
                            ) : (
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 mr-2 rounded-md mt-4 cursor-not-allowed"
                                    disabled
                                >
                                    Unavailable
                                </button>
                            )}

                            <Link to={'/'}>
                                <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4 mt-4">Go Back</button>
                            </Link>
                        </div>
                    </div>
                </div>
        
            
                
            )}
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Students Reviews</h2>
                <div className="mt-4">
                    <ul>
                        {product?.reviews?.map((review, i) => (
                            <div key={i} className="border rounded-md py-3 px-4 mb-4 shadow-sm">
                                <div className="flex items-center">
                                    {[...Array(review.rating).keys()].map(num => (
                                        <span key={num} className='text-yellow-500 mr-1'>&#9733;</span>
                                    ))}
                                </div>
                                <p className='text-gray-700'>{review.comment}</p>
                                <p className='text-gray-500'>{review.name}</p>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Write a Review</h3>
                    <div className="mt-2">
                        <label htmlFor="userReview" className="text-gray-700">Your Review:</label>
                        <textarea
                            id="userReview"
                            className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                            rows="4"
                            value={userComment}
                            onChange={e => setUserComment(e.target.value)}
                            placeholder="Write your review here..."
                        />
                    </div>
                    <div className="mt-2">
                        <label htmlFor="rating" className="text-gray-700 mr-2">Rating:</label>
                        <select
                            id="rating"
                            className="bg-white border border-gray-300 p-2 rounded-md mt-2"
                            value={userRating}
                            onChange={e => setUserRating(e.target.value)}
                        >
                            {[1, 2, 3, 4, 5].map(r => (
                                <option key={r} value={r}>{r} stars</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                        onClick={handleCreateReview}
                    >
                        Submit Review
                    </button>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Write a Review</h3>
                    <p className="text-gray-700">Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to write a review.</p>
                </div>
            </div>
        </div>
    );
}