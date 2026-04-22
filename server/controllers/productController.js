const Product = require('../models/Product');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `product-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error('Images only!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
const uploadImages = upload.array('images', 5);

// @desc   Get all products (with search, filter, pagination)
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.minRating) {
      query.rating = { $gte: Number(req.query.minRating) };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single product
// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ product, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create product
// @route  POST /api/products
// @access Admin
const createProduct = async (req, res) => {
  uploadImages(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { name, description, price, originalPrice, category, stock, brand, color, material, isFeatured } = req.body;
      const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

      const product = await Product.create({
        name, description, price, originalPrice, category, stock, brand,
        color, material, isFeatured: isFeatured === 'true', images,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc   Update product
// @route  PUT /api/products/:id
// @access Admin
const updateProduct = async (req, res) => {
  uploadImages(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const updates = req.body;
      if (req.files && req.files.length > 0) {
        updates.images = req.files.map((f) => `/uploads/${f.filename}`);
      }
      if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true';

      Object.assign(product, updates);
      const updated = await product.save();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add review
// @route  POST /api/products/:id/reviews
// @access Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: product._id });
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed this product' });

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating: Number(rating),
      comment,
      userName: req.user.name,
    });

    // Update product rating
    const allReviews = await Review.find({ product: product._id });
    product.numReviews = allReviews.length;
    product.rating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview };
