const { Doctor } = require("../../Models/DoctorsModel");
require("dotenv").config();

const getAllDoctor_External = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const doctors = await Doctor.find()
            .select('_id name availability')
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json(doctors);
    } catch (error) {


        return res.status(500).json({ error: error });
    }
};




module.exports = {
    getAllDoctor_External
}
