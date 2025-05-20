const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!name || !description || price == null || quantity == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = new Product({ name, description, price, quantity });
    await product.save();
    res.status(201).json(product.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => p.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restockProduct = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid restock quantity' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity += quantity;
    await product.save();

    res.json(product.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.lowStockAlerts = async (req, res) => {
  try {
    const threshold = 5;
    const lowStockProducts = await Product.find({ quantity: { $lt: threshold } });
    res.json(lowStockProducts.map(p => p.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.purchaseProduct = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid purchase quantity' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.quantity -= quantity;
    await product.save();

    res.json({ message: 'Purchase successful', product: product.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
