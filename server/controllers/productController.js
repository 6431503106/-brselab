import Product from "../models/productModel.js"
import asyncHandler from "express-async-handler"

const getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const query = {};

    // Apply keyword search if provided
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' }; // Example: case-insensitive search by product name
    }

    // Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // Fetch products from the database
    const products = await Product.find(query).populate('category', 'name'); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}
    const products = await Product.find({ ...keyword })
    .populate('category', 'name'); 

  res.json(products);
});*/


const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

/*const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  })

  const createdProduct = product.save()
  res.status(201).json(createdProduct)
})*/

const createProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, countInStock , numReviews, description } = req.body;

  const product = new Product({
    name,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, countInStock, description } =
    req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product Not Found")
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id

  const product = await Product.findById(productId)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.status(204).json({ message: "Product Deleted" })
  } else {
    res.status(404)
    throw new Error("Product Not Found")
  }
})

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      review => review.user._id.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product already reviewed")
    }
    const review = {
      name: req.user.name,
      rating: +rating,
      comment,
      user: req.user._id,
    }
    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({
      message: "Review Added",
    })
  } else {
    res.status(404)
    throw new Error("Product Not Found")
  }
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
}
