const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/', controller.createProduct);
router.get('/low-stock', controller.lowStockAlerts);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.put('/restock/:id', controller.restockProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

// Add purchase route here - THIS IS CRUCIAL
router.post('/purchase/:id', controller.purchaseProduct);

module.exports = router;
