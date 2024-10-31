import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Route to get products with optional filtering and to create a product
router.route('/').get(getProducts).post(protect, admin, createProduct);

// Route to get, update, and delete a specific product by ID
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Route to create a review for a specific product by ID
router.route('/:id/review').post(protect, createProductReview);

export default router;