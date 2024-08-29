const { InventoryList } = require('../../Models/InventoryList'); // Adjust the path as needed

const generateItemId = async () => {
    try {
        const count = await InventoryList.countDocuments({});
        const ItemId = `${count}`;
        return ItemId;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// Create a new inventory item
const createInventoryItem = async (req, res) => {
    try {
        let itemId = await generateItemId()
        const newInventoryItem = await InventoryList.create({ 'medicine_id': itemId, ...req.body });
        res.status(201).json(newInventoryItem);
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Get all inventory items
const getAllInventoryItems = async (req, res) => {
    try {
        const { page, pageSize, search = '' } = req.query;

        const searchAsInt = parseInt(search);

        const query = {
            $or: [
                { nameOfMedicine: { $regex: new RegExp(search, 'i') } },
                { company: { $regex: new RegExp(search, 'i') } },
                { hsnCode: { $regex: new RegExp(search, 'i') } },
                searchAsInt ? { quantity: { $lte: searchAsInt } } : null,
            ].filter(Boolean), // Remove null values from the $or array
        };


        let skip = page ? (parseInt(page) - 1) * (pageSize ? parseInt(pageSize) : 10) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        const inventoryItems = await InventoryList.find(query)
            .sort({ medicine_id: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json(inventoryItems);
    } catch (error) {


        console.log(error);

        return res.status(500).json({ error: error.message });
    }
};


// Get a specific inventory item by ID
const getInventoryItemById = async (req, res) => {
    try {
        const inventoryItem = await InventoryList.findById(req.params.id);
        if (inventoryItem) {
            res.status(200).json(inventoryItem);
        } else {
            res.status(404).json({ message: 'Inventory item not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const getInventoryItemByIds = async (req, res) => {
    let itemDatas = req.query.id;

    try {
        const inventoryItems = await InventoryList.find({ _id: { $in: itemDatas } });

        if (inventoryItems && inventoryItems.length > 0) {
            res.status(200).json(inventoryItems);
        } else {
            res.status(404).json({ message: 'Inventory items not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Update an inventory item by ID
const updateInventoryItemById = async (req, res) => {
    try {
        const updatedInventoryItem = await InventoryList.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedInventoryItem) {
            res.status(200).json(updatedInventoryItem);
        } else {
            res.status(404).json({ message: 'Inventory item not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Delete an inventory item by ID
const deleteInventoryItemById = async (req, res) => {
    try {
        const deletedInventoryItem = await InventoryList.findByIdAndDelete(
            req.params.id
        );
        if (deletedInventoryItem) {
            res.status(200).json(deletedInventoryItem);
        } else {
            res.status(404).json({ message: 'Inventory item not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const dropInventoryCollection = async (req, res) => {
    try {
        await InventoryList.collection.drop()
        res.status(200).json({ message: 'Inventory collection dropped successfully.' });
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const uploadBulkInventory = async (req, res) => {
    try {
        const bulkInventoryItems = await Promise.all(req.body.map(async (item) => {
            const itemId = await generateItemId();
            return { 'medicine_id': itemId, ...item };
        }));

        const newInventoryItems = await InventoryList.create(bulkInventoryItems);
        res.status(201).json('uploaded');
    } catch (error) {


        console.log(error)
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createInventoryItem,
    getAllInventoryItems,
    getInventoryItemById,
    updateInventoryItemById,
    deleteInventoryItemById,
    uploadBulkInventory,
    dropInventoryCollection,
    getInventoryItemByIds
};
