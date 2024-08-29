const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedbackPatients, getAllFeedback, getFeedbackById, deleteFeedback, updateFeedbackById } = require('../Controllers/feedbackController');

// // Define the route for submitting feedback
// router.post('/', feedbackController.createFeedback);
// router.get('/', feedbackController.getAllFeedback);
// router.get('/:id', feedbackController.getFeedbackById);
// router.delete('/:id', feedbackController.deleteFeedback);
// router.patch('/:id', feedbackController.updateFeedbackById);

router.route('/').post(createFeedback);
router.route('/').get(getAllFeedback);
router.route('/patients').get(getAllFeedbackPatients);
router.route('/:id').get(getFeedbackById);
router.route('/:id').put(updateFeedbackById);
router.route('/:id/:commentId').delete(deleteFeedback);


module.exports = router;
