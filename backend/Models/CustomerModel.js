const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstName: { type: String },
  middleName: { type: String },
  surname: { type: String },
  email: { type: String },
  bloodGroup: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  motherTongue: { type: String },
  education: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  area: { area: String },
  payment: { type: String },
  reference: { type: String },
  patient_reference: { type: String, default: '' },
  location: { type: String },
  pincode: { type: Number },
  patientReference: { type: String },
  patientStatus: { type: String },
  profession: { type: String },
  profile_image: [],
  mobile: { type: String },
  role: { type: String, enum: ["Customer"], required: true, default: "Customer" },
  customerId: { type: String },
  status: { type: String },
  patientId: { type: String },
  date: { type: String },
  dateOfBirth: { type: String },
  anniversary: { type: String },
  weight: { type: String },
  height: { type: String },
  diagnosis: { type: Object },
  package: { type: String },
  industry: { type: String },
  package: { type: Number },

  previousReports: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reports.file'
  },
  previousTreatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reports.file'
  },
  pictures: [],
  externalUploads:[],
  CaseRating: { type: Number },
  CaseMark: { type: Boolean, default: false },
  ReviewMark: { type: Boolean, default: false },
  PatientStatus: { type: String, default: '' },
  Patient_Type: { type: String, default: '' }


});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer };
