const { json } = require("express");
const { Prescription } = require("../Models/PrescriptionModel");

const MedicinePrescription = { 0: { name: '', duration: '' } }
const SupplimentoryMedicine = { 0: { name: '', duration: '', fees: '' } }

const createPrescription = async (req, res) => {

    try {
        // Other code for validation, finding patient, etc.
        const results = [];
        for (const data of req.body) {
            const { _id, Date, ...otherFields } = data;
            const { paitendId } = data;
            const { customerId } = data;
            // Check if it's already exist or not
            if (_id) {
                const isExist = await Prescription.findOne({ _id, patient: customerId, doctor: data.doctorId });
                if (isExist) {
                    const updatedData = { Date, ...otherFields };
                    const result = await updatePrescription(_id, updatedData);
                    results.push(result);
                }
            } else {

                const prescription = new Prescription({
                    PrescriptionId: `${paitendId}${String(Date)?.replaceAll('-', '')}`,
                    Date,
                    Symptoms: otherFields.Symptoms || '',
                    Treatment: otherFields.Treatment || '',
                    MedicinePrescription: otherFields.MedicinePrescription || MedicinePrescription,
                    SupplimentoryMedicine: otherFields.SupplimentoryMedicine || SupplimentoryMedicine,
                    ReportsPrescription: otherFields.ReportsPrescription || '',
                    Suggestions: otherFields.Suggestions || '',
                    ProbableTreatment: otherFields.ProbableTreatment || '',
                    Other: otherFields.Other || '',
                    PreviousReportNotes: otherFields.PreviousReportNotes || '',
                    PreviousTreatmentNotes: otherFields.PreviousTreatmentNotes || '',
                    PreviousPicturesNotes: otherFields.PreviousPicturesNotes || '',
                    patient: customerId || '655346f03a8597d656382c3e',
                    doctor: data.doctorId || "654730da148ec060c2d52d55", // Uncomment this if you want to reference a doctor
                    PaymentDetails: data.PaymentDetails || {},
                    total: data?.total,
                    PaymentMode: data?.PaymentMode || '',
                    ReceivedBy: data?.ReceivedBy || '',
                    paid: data?.paid || 0,
                    PatientStatus: data?.PatientStatus || '',
                    Patient_Type: data?.Patient_Type || ''
                });

                await prescription.save();
                results.push({ status: 201, message: 'Prescription created successfully.' });
            }
        }

        res.status(200).json(results);
    } catch (error) {


        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


const updatePrescription = async (PrescriptionId, updateData) => {
    console.log("Check Updataed data", updateData)
    try {
        const prescription = await Prescription.findByIdAndUpdate(PrescriptionId, updateData, {
            new: true, // Return the updated Customer object
        });

        return { status: 200, message: 'Prescription updated successfully' };

    } catch (error) {


        return { status: 500, message: error.message };
    }
};


const getAllPrescriptions = async (req, res) => {
    try {
        const { page, pageSize, doctorId, patientId } = req.query;

        let query = {};

        if (req.accessFilter) {
            query = { ...req.accessFilter }
        }

        // if (doctorId) {
        //     query.doctor = doctorId;
        // }

        if (patientId) {
            query.patient = patientId;
        }

        const skip = page ? (parseInt(page) - 1) * (pageSize ? parseInt(pageSize) : 10) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        let prescriptions = await Prescription.find(query, req.secondaryAccessFilter)
            .sort({ Date: -1 })
            .skip(skip)
            .limit(limit);



        const prettifiedJSON = JSON.stringify(prescriptions, null, 2);



        res.status(200).send(prettifiedJSON); // Use res.send to send the prettified JSON
    } catch (error) {


        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


const getFilteredPrescription = async (req, res) => {
    try {
        const { doctorId, patientId, startDate, endDate, page, pageSize } = req.query;
        const { search } = req.body;

        const query = {};

        if (startDate && endDate) {
            query.Date = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        // Add custom filters from request body
        if (search && typeof search === 'object') {
            Object.keys(search).forEach((field) => {
                query[field] = search[field];
            });
        }

        const skip = page ? (parseInt(page) - 1) * (pageSize ? parseInt(pageSize) : 10) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        const prescriptions = await Prescription.find(query)
            .sort({ Date: 1 })
            .skip(skip)
            .limit(limit);

        const prettifiedJSON = JSON.stringify(prescriptions, null, 2);
        res.status(200).send(prettifiedJSON);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


// Dashbaord functions to calculate data

const getPrescriptionStatusData = async (req, res) => {

    const weeks = getPrevious5WeeksDateRanges(new Date()?.toISOString()?.slice(0, 10))
    const startDate = weeks?.[0]?.startDate
    const lastDate = weeks?.at(-1)?.endDate
    const { typeFilter } = req.query

    try {
        const pipeline = [
            // Match documents within the desired date range(adjust the date range as needed)
            {
                $match: {
                    Date: { $gte: startDate, $lte: lastDate },
                },
            },
            // Group by Patient Status and Week, counting occurrences
            {
                $group: {
                    _id: {
                        status: `$${typeFilter}`,
                        week: { $week: { $dateFromString: { dateString: "$Date" } } },
                    },
                    count: { $sum: 1 },
                },
            },
            // Project the data to the desired format
            {
                $project: {
                    _id: 0,
                    status: "$_id.status",
                    week: "$_id.week",
                    count: 1,
                },
            },
            // Sort the data based on status and week
            {
                $sort: {
                    status: 1,
                    week: 1,
                },
            },
        ];

        const result = await Prescription.aggregate(pipeline);

        // Transform the result into the desired format
        const formattedResult = result.reduce((acc, entry) => {
            const { status, week, count } = entry;
            if (!acc[week]) {
                acc[week] = {};
            }
            acc[week][status] = count;
            return acc;
        }, {});
        res.status(200).json(formattedResult);

    } catch (error) {


        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const deletePrescriptionById = async (req, res) => {
    let { role } = req.userAbility


    if (role !== 'MainDoctor') {
        return res.status(400).send('Only main doctor can delete prescription')
    }
    const { prescriptionId } = req.params;

    try {
        const deletedPrescription = await Prescription.findOneAndDelete({ _id: prescriptionId });
        if (deletedPrescription) {
            res.status(200).json({ message: 'Prescription deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Prescription not found.' });
        }
    } catch (error) {


        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



const getFeesCollectedData = async (req, res) => {
    try {
        // Calculate start date and end date for the last 5 weeks
        const weeks = getPrevious5WeeksDateRanges(new Date()?.toISOString()?.slice(0, 10))
        const startDate = weeks?.[0]?.startDate
        const lastDate = weeks?.at(-1)?.endDate

        const pipeline = [
            // Match documents within the last 5 weeks
            {
                $match: {
                    Date: { $gte: startDate, $lte: lastDate },
                },
            },
            // Project only the relevant fields
            {
                $project: {
                    _id: 0,
                    PaymentMode: 1,
                    paid: 1,
                    IsOnline: 1,
                    IsConsultant: 1,
                },
            },
            // Add a new field 'ConsultationType' based on conditions
            {
                $addFields: {
                    ConsultationType: {
                        $cond: {
                            if: { $eq: ["$IsOnline", true] },
                            then: "Online Consultation",
                            else: {
                                $cond: {
                                    if: { $eq: ["$IsConsultant", true] },
                                    then: "Consultation Consultation",
                                    else: "Clinic Consultation",
                                },
                            },
                        },
                    },
                },
            },
            // Group by PaymentMode and ConsultationType, summing up the paid amounts
            {
                $group: {
                    _id: {
                        paymentMode: "$PaymentMode",
                        consultationType: "$ConsultationType",
                    },
                    totalPaid: { $sum: "$paid" },
                },
            },
            // Project the data to the desired format
            {
                $project: {
                    _id: 0,
                    paymentMode: "$_id.paymentMode",
                    consultationType: "$_id.consultationType",
                    totalPaid: 1,
                },
            },
            // Sort the data based on paymentMode and consultationType
            {
                $sort: {
                    paymentMode: 1,
                    consultationType: 1,
                },
            },
        ];

        const result = await Prescription.aggregate(pipeline);

        res.status(200).json(result);
    } catch (error) {


        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



function getPrevious5WeeksDateRanges(todayDate) {
    const dateRanges = [];

    // Convert input string to Date object
    const today = new Date(todayDate);

    // Calculate start and end date of each of the previous 5 weeks
    for (let weekNum = 5; weekNum > 0; weekNum--) {
        const endOfWeek = new Date(today.getTime() - (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(endOfWeek.getTime() - 6 * 24 * 60 * 60 * 1000);

        const formattedStartDate = startOfWeek.toISOString().split('T')[0];
        const formattedEndDate = endOfWeek.toISOString().split('T')[0];

        dateRanges.push({ startDate: formattedStartDate, endDate: formattedEndDate });
    }

    return dateRanges;
}

module.exports = { createPrescription, getAllPrescriptions, getFilteredPrescription, getPrescriptionStatusData, getFeesCollectedData, deletePrescriptionById }
