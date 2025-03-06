const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products with pagination, sorting, and filtering
router.get("/", async (req, res) => {
  try {
    // Set timeout for the query
    const queryTimeout = 10000; // 10 seconds

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive search
    }
    if (req.query.stock) {
      filter.stock = { $gte: parseInt(req.query.stock) };
    }

    // Sorting
    const sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(",").map((field) => {
        const order = field.startsWith("-") ? -1 : 1;
        return [field.replace("-", ""), order];
      });
      sortFields.forEach(([field, order]) => {
        sort[field] = order;
      });
    }

    // Execute query with timeout
    const queryPromise = Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const countPromise = Product.countDocuments(filter);

    const [products, total] = await Promise.all([
      Promise.race([
        queryPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Query timeout")), queryTimeout)
        ),
      ]),
      Promise.race([
        countPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Count timeout")), queryTimeout)
        ),
      ]),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      filters: {
        applied: Object.keys(filter).length > 0 ? filter : null,
      },
      sorting: {
        applied: Object.keys(sort).length > 0 ? sort : null,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean().exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      description: req.body.description,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      message: "Error creating product",
      error: error.message,
    });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    if (req.body.category) product.category = req.body.category;
    if (req.body.stock) product.stock = req.body.stock;
    if (req.body.description) product.description = req.body.description;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({
      message: "Error updating product",
      error: error.message,
    });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
});

module.exports = router;
