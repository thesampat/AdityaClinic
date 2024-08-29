const mongoose = require("mongoose");

const appointmentStatusEnum = ['Pending', 'Completed', 'Cancelled', 'Booked'];

const appointmentSchema = new mongoose.Schema(
  {
    patient: {},
    doctor: {},
    bookDate: { type: String },
    bookTimeSlot: {},
    status: {
      type: String,
      enum: appointmentStatusEnum,
      default: "Pending",
    },
    IsConsultant: { type: Boolean, default: true },
    IsAssistantDoctor: { type: Boolean, default: false },
    IsDoctor: { type: Boolean, default: false },
    IsOnline: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = { Appointment, appointmentStatusEnum };
