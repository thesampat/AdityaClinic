const Feedback = require('../Models/Feedback');

const createFeedback = async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback?._id);
    } catch (error) {


        res.status(500).json({ error: "Error creating feedback" });
    }
}

const getAllFeedbackPatients = async (req, res) => {
    try {
        const feedback = await Feedback.find({}, { FirstName: 1, LastName: 1 })
        res.status(200).json(feedback);
    } catch (error) {


        res.status(500).json({ error: "Error fetching feedback" });
    }
}

const getAllFeedback = async (req, res) => {

    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Define a query object to filter based on search term
        const query = {
            $or: [
                { FirstName: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
            ],
        };

        const feedback = await Feedback.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json(feedback);
    } catch (error) {


        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getFeedbackById = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.status(200).json(feedback);
    } catch (error) {


        res.status(500).json({ error: "Error fetching feedback" });
    }
}

const deleteFeedback = async (req, res) => {
    try {
        const updateFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,

            { $pull: { comments: { _id: req.params.commentId } } },
            { new: true }
        );

        if (!updateFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json(updateFeedback);
    } catch (error) {


        console.error('Error removing comment from feedback:', error);
        res.status(400).json({ message: error.message });
    }
}




const updateFeedbackById = async (req, res) => {
    try {
        const updateFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: req.body.comments } },
            { new: true }
        );

        if (!updateFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json(updateFeedback);
    } catch (error) {


        console.error('Error updating feedback:', error);
        res.status(400).json({ message: error.message });
    }
}


module.exports = {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    deleteFeedback,
    updateFeedbackById,
    getAllFeedbackPatients
};
