const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  PrescriptionId: { type: String },
  Date: { type: String },
  Symptoms: { type: String, default: null },
  Treatment: { type: String, default: null },
  MedicinePrescription: {
    type: Map,
    of: {
      name: { type: String, default: '' },
      duration: { type: String, default: '' },
    },
    default: {},
  },
  SupplimentoryMedicine: {
    type: Map,
    of: {
      name: { type: String, default: '' },
      duration: { type: String, default: '' },
      fees: { type: String, default: '' },
    }
  },
  ReportsPrescription: { type: String, default: null },
  Suggestions: { type: String, default: null },
  ProbableTreatment: { type: String, default: null },
  Other: { type: String, default: null },
  PreviousReportNotes: { type: String, default: null },
  PreviousTreatmentNotes: { type: String, default: null },
  PreviousPicturesNotes: { type: String, default: null },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // This should reference your Customer model
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference your Doctor model
    required: true,
  },
  previousReports: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reports.file'
  },
  previousTreatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reports.file'
  },
  pictures: [],
  PaymentDetails: {},
  total: { type: Number },
  PaymentMode: { type: String },
  ReceivedBy: { type: String },
  paid: { type: Number },
  Appointment_type: { type: String },


});
const Prescription = mongoose.model("prescriptions", prescriptionSchema);

module.exports = { Prescription };
