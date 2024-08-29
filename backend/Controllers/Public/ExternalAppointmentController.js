const { Appointment } = require('../../Models/AppointmentModel')

const createExternalAppointment = async (req, res) => {
    try {
        const {
            patient,
            doctor,
            date = new Date().toISOString(),
            bookDate,
            bookTimeSlot,
            status,
            IsOnline,
            selectedRole,
            IsDoctor,
            IsConsultant,
            IsAssistantDoctor
        } = req.body;

        // Check if the appointment already exists for the specified time slot and date
        let IsAppointmentExist = await Appointment.find({
            'bookTimeSlot': bookTimeSlot,
            'bookDate': { $regex: `^${String(bookDate)?.slice(0, 10)}` }
        });

        if (IsAppointmentExist.length > 0) {
            return res.status(500).json({ error: "Appointment Is Already Booked" });
        }

        // Create a new appointment using the updated schema
        const appointment = new Appointment({
            patient,
            doctor,
            IsOnline,
            date,
            bookDate: String(bookDate).slice(0, 10),
            bookTimeSlot,
            status,
            selectedRole,
            IsDoctor,
            IsConsultant,
            IsAssistantDoctor
        });

        // Save the appointment to the database
        await appointment.save();

        // Respond with the created appointment
        res.status(201).json(appointment);
    } catch (error) {


        console.error(error);
        res.status(500).json({ error: "Appointment creation failed" });
    }
};


const getAppointment_External = async (req, res) => {
    try {
        const doctorName = req.query.doctorName || ''; // Get the doctorId from the query string
        const query = doctorName ? { doctorName: doctorName } : {}; // Create a query object

        const appointments = await Appointment.find(query);
        res.json(appointments);
    } catch (error) {


        console.error(error);
        res.status(500).json({ error: "Failed to retrieve appointments" });
    }
};


module.exports = { createExternalAppointment, getAppointment_External }