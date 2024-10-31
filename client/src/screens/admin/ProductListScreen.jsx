import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../slices/productsApiSlice';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import TablePagination from '@mui/material/TablePagination';
import Swal from 'sweetalert2';

export default function ProductListScreen() {
    const navigate = useNavigate();
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || "");
    const [currentPage, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { state } = useLocation();
    useEffect(() => {
        if (state?.refetch) {
            refetch();  // Trigger refetch if state indicates it
        }
        if (state?.message) {
            toast.success(state.message);  // Display success message if it exists
        }
    }, [state, refetch]);

    useEffect(() => {
        if (!isLoading && products) {
            handleSearchFilter();
        }
    }, [keyword, products]);

    useEffect(() => {
        paginate(0);
    }, [filteredProducts]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchValue) || product._id.toLowerCase().includes(searchValue)
        );
        setFilteredProducts(filteredProducts);
    };

    const createProductHandler = () => {
        navigate('/admin/product/create'); // Navigate to create a new product
    };

    const editProductHandler = id => {
        navigate(`/admin/product/${id}/edit`);
    };

    const deleteProductHandler = async id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteProduct(id).unwrap();
                    refetch();
                    toast.success(res.message);
                } catch (error) {
                    toast.error(error?.data?.message || error?.error);
                }
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginate = pageNumber => setPage(pageNumber);

    const indexOfLastProduct = (currentPage + 1) * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading products</div>;

    return (
        <div>
            <div className="content-wrapper justify-start sidebar-open">
                <h2 className="text-3xl font-semibold mb-3">All Products</h2>
            </div>

            <div className="content-menu flex justify-between mb-2 sidebar-open">
            <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search Products"
                        className="border border-gray-300 p-2 rounded-lg shadow-sm w-full md:w-60"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                    <button
                        onClick={handleSearchFilter}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                        Search
                    </button>
                </div>
                <div className="flex">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                        onClick={createProductHandler}
                    >
                        Create Product
                    </button>
                </div>
                {loadingCreate && <Spinner />}
            </div>

            <div className="content-table">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product Image
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Product ID
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.map(product => (
                            <tr key={product._id}>
                                <td className="table-cell px-4 py-3 text-center whitespace-nowrap">
                                    <img src={product.image} alt={product.name} className="img-small" />
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product.name}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product._id}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product.countInStock}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">{product.category.name}</td> {/* Display category name */}
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                        onClick={() => editProductHandler(product._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => deleteProductHandler(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loadingDelete && <Spinner />}
                    </tbody>
                </table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}