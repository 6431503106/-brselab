import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
        res.status(400);
        throw new Error('Category name is required');
    }
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }
    
    const category = new Category({ name });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

export { getCategories, createCategory };