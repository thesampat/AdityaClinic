const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    date: String,
    content: String,
    signature: String,
    rating: Number,
});

const feedbackSchema = new mongoose.Schema({
    Status: String,
    CaseNo: String,
    Date: String,
    FirstName: String,
    MiddleName: String,
    LastName: String,
    dateOfBirth: String,
    bloodGroup: String,
    gender: String,
    mobile: String,
    maritalStatus: String,
    motherTongue: String,
    state: String,
    education: String,
    address: String,
    profession: String,
    industry: String,
    email: String,
    complaints: [{ content: String }],
    comments: [commentSchema],
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
