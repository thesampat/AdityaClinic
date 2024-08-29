const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const conn = mongoose.connection;
const fs = require('fs');
const { Receptionist } = require('../Models/ReceptionistModel');
const { Consultant } = require('../Models/ConsultantModel');
const { Customer } = require('../Models/CustomerModel');
const { AssistantDoctor } = require('../Models/AssitantDoctorModel');
const { Doctor } = require('../Models/DoctorsModel');

require('dotenv').config();


const getModal = (section_Type) => {
    switch (section_Type) {
        case '/receptionist':
            return Receptionist
        case '/consultant':
            return Consultant
        case '/customer':
            return Customer
        case '/assistantDoctor':
            return AssistantDoctor
        case '/doctor':
            return Doctor
    }
}

const client = new mongoose.mongo.MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = client.db(client.options.dbName);
const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'reports' });

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'reports', // Name of the GridFS bucket for reports
        };
    },
});

const UploadReport = async (req, res) => {
    const itemId = req.params.itemId;
    const uploadType = req.params.uploadType;
    const CustomModal = getModal(req.baseUrl)

    if (['pictures', 'profile_image']?.includes(uploadType)) {
        const upload = multer({ storage }).array('images', 10);
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                console.error('Error uploading pictures:', uploadErr);
                return res.status(500).json({ error: 'An error occurred while uploading the pictures' });
            }
            try {
                const fileIds = req.files.map((file) => file.id);

                await CustomModal.findByIdAndUpdate(itemId, { [uploadType]: fileIds }, { new: true });

                return res.status(200).send('uploaded');
            } catch (error) {


                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        });
    } else {
        const upload = multer({ storage }).single('document');
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                console.error('Error uploading report:', uploadErr);
                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
            try {
                await CustomModal.findByIdAndUpdate(itemId, { [uploadType]: req.file.id }, { new: true });
                return res.status(200).send('uploaded');
            } catch (error) {


                console.log(error)
                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        });
    }
};

const UploadMultipleDocs = async (req, res) => {
    const itemId = req.params.itemId;
    const uploadType = req.params.uploadType;
    const CustomModal = getModal(req.baseUrl)

    const handleDocumentUpload = multer({ storage }).array('multipleDocs', 10);

    handleDocumentUpload(req, res, async (uploadErr) => {
        if (uploadErr) {
            console.error('Error uploading documents:', uploadErr);
            return res.status(500).json({ error: 'An error occurred while uploading the documents' });
        }

        try {
            const fileData = req.files.map((file) => ({ name: file.originalname, id: file.id }));

            await CustomModal.findByIdAndUpdate(itemId, { [uploadType]: fileData }, { new: true });

            return res.status(200).send('uploaded');
        } catch (error) {


            return res.status(500).json({ error: 'An error occurred while uploading the documents' });
        }
    });
};


const deleteReport = async (req, res) => {
    const file_id = req.params.id;
    const itemId = req.params.itemId;
    const uploadType = req.params.uploadType;
    const CustomModal = getModal(req.baseUrl)

    let cursor;
    try {
        cursor = bucket.find(new mongoose.Types.ObjectId(file_id));
    } catch (error) {


        return res.status(400).send('invalid object id');
    }

    const files = await cursor.toArray();

    if (files.length === 0) {
        return res.status(404).json({ error: 'File not found' });
    }

    for (const file of files) {
        const fileId = file._id;
        try {
            await bucket.delete(fileId);
            try {
                await CustomModal.findByIdAndUpdate(itemId, { $unset: { [uploadType]: 1 } }, { new: true });
                res.status(200).send('File Removed');
            } catch (error) {


                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        } catch (error) {


            console.error(`Error deleting file with _id ${fileId}:`, error);
            return res.status(500).json({ error: 'An error occurred while deleting the file' });
        }
    }
};

const getReport = async (req, res) => {
    const fileId = req.params.id;

    console.log(fileId)
    try {
        const fileTypeRes = bucket.find(new mongoose.Types.ObjectId(fileId))
        const files = await fileTypeRes.toArray();

        const downloadStream = bucket.openDownloadStreamByName(files?.[0]?.filename);

        downloadStream.on('error', (err) => {
            console.error('Error while opening download stream:', err);
            return res.status(500).json({ error: 'An error occurred' });
        });

        res.setHeader('Content-Type', files?.[0]?.contentType);
        res.setHeader('Content-Disposition', `inline`);
        const dispositionHeader = `inline; filename="${files?.[0]?.filename}"`;
        res.setHeader('Content-Disposition', dispositionHeader);
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error)
        res.status(400).send('Could not get report');
    }
};

const getImage = async (req, res) => {
    const fileId = req.params.id;

    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        downloadStream.on('error', (err) => {
            console.error('Error while opening download stream:', err);
            return res.status(500).json({ error: 'An error occurred' });
        });

        res.setHeader('Content-Type', 'image');
        res.setHeader('Content-Disposition', `inline`);

        downloadStream.pipe(res);
    } catch (error) {


        res.status(400).send('Count not load image');
    }
};

const deleteImages = async (req, res) => {
    const { fileIds } = req.body;
    const itemId = req.params.itemId;
    const uploadType = req.params.uploadType;
    const CustomModal = getModal(req.baseUrl)


    if (!Array.isArray(fileIds)) {
        return res.status(400).json({ error: 'fileIds must be an array' });
    }

    const deletePromises = [];
    let cursor;
    for (const fileId of fileIds) {
        try {
            cursor = bucket.find(new mongoose.Types.ObjectId(fileId));
        } catch (error) {


            return res.status(400).send('Invalid Object Id');
        }

        const file = await cursor.toArray();

        if (!file) {
            return res.status(404).json({ error: `File with ID ${fileId} not found` });
        }
        const deletePromise = bucket.delete(file?.[0]?._id);
        deletePromises.push(deletePromise);
    }

    try {
        await Promise.all(deletePromises);

        await CustomModal.findByIdAndUpdate(itemId, { $unset: { [uploadType]: 1 } }, { new: true });
        res.status(200).send('Files Removed');
    } catch (error) {


        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the files or updating the prescription' });
    }
};

module.exports = { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadMultipleDocs, UploadMultipleDocs };
