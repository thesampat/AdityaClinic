const { Distributor } = require('../../Models/DistributorModel'); // Adjust the path as needed

// Create a new distributor
const createDistributor = async (req, res) => {
    try {
        const newDistributor = await Distributor.create(req.body);
        res.status(201).send({ msg: 'distrubutor added', data: newDistributor?._id });
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Get all distributors
const getAllDistributors = async (req, res) => {
    try {
        const { search, page, pageSize, qtype } = req.query;
        let secondQuery = {}

        let query = {};



        if (typeof search == 'string') {
            query = {
                $or: [
                    { companyName: { $regex: new RegExp(search, 'i') } },
                    { ownerName: { $regex: new RegExp(search, 'i') } },
                    {
                        companies: {
                            $elemMatch: {
                                $regex: new RegExp(search, 'i')
                            }
                        }
                    }
                ].filter(Boolean), // Remove null values from the $or array
            };
        }
        else {
            const searchObject = JSON.parse(decodeURIComponent(search || '{}'));

            if (Object.keys(searchObject)?.length > 0) {
                Object.keys(searchObject).forEach((field) => {
                    query[field] = searchObject[field];

                    if (field == 'companies.name') {
                        secondQuery['companies'] = 0
                    }

                });
            }
        }

        if (qtype == 'list') {
            secondQuery['companies'] = 0
        }

        const skip = page ? (parseInt(page) - 1) * (pageSize ? parseInt(pageSize) : 10) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        const distributors = await Distributor.find(query, secondQuery)
            .sort({ medicine_id: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(distributors);
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};



// Get a specific distributor by ID
const getDistributorById = async (req, res) => {
    const { id } = req.params

    console.log(id)
    try {
        const distributor = await Distributor.findById(id);

        if (distributor) {
            res.status(200).json(distributor);
        } else {
            res.status(404).json({ message: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Update a distributor by ID
const updateDistributorById = async (req, res) => {
    try {
        const updatedDistributor = await Distributor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedDistributor) {
            res.status(200).json(updatedDistributor);
        } else {
            res.status(404).json({ message: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

// Delete a distributor by ID
const deleteDistributorById = async (req, res) => {
    try {
        const deletedDistributor = await Distributor.findByIdAndDelete(
            req.params.id
        );
        if (deletedDistributor) {
            res.status(200).json(deletedDistributor);
        } else {
            res.status(404).json({ message: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};


/// add companies 
const generateItemId = async () => {
    try {
        const count = await Distributor.countDocuments({});
        const ItemId = `${count}`;
        return ItemId;
    } catch (err) {
        console.error(err);
        return null;
    }
};


const addCompanyToDistributor = async (req, res) => {
    const { distributorId } = req.params;

    try {
        const distributor = await Distributor.findById(distributorId);
        const company_index = distributor.companies?.length
        if (distributor) {
            distributor.companies.push({ ...req.body, company_index: company_index });
            await distributor.save();
            res.status(200).json({ ...req.body, company_index: company_index });
        } else {
            res.status(404).json({ error: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const updateCompanyInDistributor = async (req, res) => {
    const { distributorId, companyIndex } = req.params;
    const { updatedCompanyData } = req.body;

    try {
        const distributor = await Distributor.findById(distributorId);
        if (distributor) {
            const companyToUpdate = distributor.companies[companyIndex];
            if (companyToUpdate) {
                Object.assign(companyToUpdate, updatedCompanyData);
                await distributor.save();
                res.status(200).json(distributor);
            } else {
                res.status(404).json({ error: 'Company not found' });
            }
        } else {
            res.status(404).json({ error: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const removeCompanyFromDistributor = async (req, res) => {
    const { distributorId, companyIndex } = req.params;

    try {
        const distributor = await Distributor.findById(distributorId);
        if (distributor) {
            const removedCompany = distributor.companies.splice(companyIndex, 1);
            await distributor.save();
            res.status(200).json({ removedCompany, distributor });
        } else {
            res.status(404).json({ error: 'Distributor not found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};

const getDistributorByNameOfMedicine = async (req, res) => {
    try {
        const itemDatas = Array.isArray(req.query.mname) ? req.query.mname : [req.query.mname];

        const inventoryItems = await Distributor.aggregate([
            { $unwind: "$companies" },
            { $match: { "companies.name": { $in: itemDatas } } },
            {
                $project: {
                    "email": 1, "companies.name": 1, "companyName": 1
                }
            }
        ]);

        if (inventoryItems && inventoryItems.length > 0) {
            res.status(200).json(inventoryItems);
        } else {
            res.status(404).json({ message: 'No matching inventory items found' });
        }
    } catch (error) {


        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createDistributor,
    getDistributorByNameOfMedicine,
    getAllDistributors,
    getDistributorById,
    updateDistributorById,
    deleteDistributorById,
    addCompanyToDistributor,
    updateCompanyInDistributor,
    removeCompanyFromDistributor,
};
