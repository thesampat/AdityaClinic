const { createDistributor, getAllDistributors, getDistributorById, getDistributorByNameOfMedicine, updateDistributorById, deleteDistributorById, addCompanyToDistributor, updateCompanyInDistributor, removeCompanyFromDistributor } = require("../Controllers/Inventory/distributor");
const { createOrder, getAllOrders, getOrderById, getOrderByIds, updateOrderById, deleteOrderById, getAllOrderIds } = require("../Controllers/Inventory/order_purchase_list");
const { createReturnOrder, getAllReturnOrders, getReturnOrderById, updateReturnOrderById, deleteReturnOrderById } = require("../Controllers/Inventory/order_return_list");
const { createInventoryItem, getAllInventoryItems, getInventoryItemById, getInventoryItemByIds, updateInventoryItemById, deleteInventoryItemById, uploadBulkInventory, dropInventoryCollection } = require("../Controllers/Inventory/inventory_list");
const express = require('express')
const router = express.Router();

router.post('/distributors', createDistributor);
router.get('/distributors', getAllDistributors);
router.get('/distributors/:id', getDistributorById);
router.put('/distributors/:id', updateDistributorById);
router.delete('/distributors/:id', deleteDistributorById);
router.get('/distributorsByMedicine', getDistributorByNameOfMedicine);

router.post('/distributors/company/:distributorId', addCompanyToDistributor);
router.delete('/distributors/company/:distributorId/:companyIndex', removeCompanyFromDistributor);
router.put('/distributors/company/:distributorId/:companyIndex', updateCompanyInDistributor);


// Order/Purchase List routes
router.post('/orders', createOrder);
router.get('/orders', getAllOrders);
router.get('/ordersIds', getOrderByIds);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrderById);
router.delete('/orders/:id', deleteOrderById);
router.get('/ids/orders/', getAllOrderIds);


router.post('/returns', createReturnOrder);
router.get('/returns', getAllReturnOrders);
router.get('/returns/:id', getReturnOrderById);
router.put('/returns/:id', updateReturnOrderById);
router.delete('/returns/:id', deleteReturnOrderById);

// Inventory List routes
router.post('/inventory', createInventoryItem);
router.get('/inventory', getAllInventoryItems);
router.get('/inventory/:id', getInventoryItemById);
router.get('/inventoryIds', getInventoryItemByIds);
router.put('/inventory/:id', updateInventoryItemById);
router.delete('/inventory/:id', deleteInventoryItemById);
router.post('/inventory/upload/bulk', uploadBulkInventory);
router.delete('/inventory/delete/bulk', dropInventoryCollection);


module.exports = router