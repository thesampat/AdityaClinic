const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const conn = mongoose.connection;
const { Prescription } = require("../Models/PrescriptionModel");
const fs = require('fs');

require("dotenv").config()

const client = new mongoose.mongo.MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = client.db('DB2_Aditya');
const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'reports' });


// Define storage engine using multer-gridfs-storage
const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'reports', // Name of the GridFS bucket for reports
        };
    },
});

// POST endpoint for uploading a single report
const UploadReport = async (req, res) => {
    const prescriptionId = req.params.prescriptionId;
    const uploadType = req.params.uploadType



    if (uploadType == 'pictures') {
        const upload = multer({ storage }).array('images', 10); 
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                console.error('Error uploading pictures:', uploadErr);
                return res.status(500).json({ error: 'An error occurred while uploading the pictures' });
            }
            try {
                const fileIds = req.files.map((file) => file.id);

                await Prescription.findByIdAndUpdate(prescriptionId, { [uploadType]: fileIds }, { new: true });

                return res.status(200).send('uploaded');
            } catch (error) {


                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        });
    }
    else {
        const upload = multer({ storage }).single('document');
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                console.error('Error uploading report:', uploadErr);
                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
            try {
                await Prescription.findByIdAndUpdate(prescriptionId, { [uploadType]: req.file.id }, { new: true });
                return res.status(200).send('uploaded');
            } catch (error) {


                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        });
    }


}


const deleteReport = async (req, res) => {
    const file_id = req.params.id;
    const prescription_id = req.params.presid
    const uploadType = req.params.uploadType

    // Find the file by filename
    let cursor
    try {
        cursor = bucket.find(new mongoose.Types.ObjectId(file_id));
    } catch (error) {


        return res.status(400).send('invalid object id')
    }

    const files = await cursor.toArray();

    if (files.length === 0) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Delete each file found by their _id
    for (const file of files) {
        const fileId = file._id;
        try {
            await bucket.delete(fileId);
            try {
                await Prescription.findByIdAndUpdate(prescription_id, { $unset: { [uploadType]: 1 } }, { new: true });
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

    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        downloadStream.on('error', (err) => {
            console.error('Error while opening download stream:', err);
            return res.status(500).json({ error: 'An error occurred' });
        });

        res.setHeader('Content-Type', 'application/pdf'); 
        res.setHeader('Content-Disposition', `inline`); 

        // Pipe the download stream to the response
        downloadStream.pipe(res);
    } catch (error) {


        res.status(400).send('Could not get report')
    }

}


const getImage = async (req, res) => {
    const fileId = req.params.id;

    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        downloadStream.on('error', (err) => {
            console.error('Error while opening download stream:', err);
            return res.status(500).json({ error: 'An error occurred' });
        });

        // Set appropriate response headers (content type and disposition)
        res.setHeader('Content-Type', 'image'); // Set the appropriate content type
        res.setHeader('Content-Disposition', `inline`); // Specify how the browser should handle the file

        // Pipe the download stream to the response
        downloadStream.pipe(res);
    } catch (error) {


        res.status(400).send('Count not load image')
    }

}



const deleteImages = async (req, res) => {
    const { fileIds } = req.body;
    const prescription_id = req.params.presid;
    const uploadType = req.params.uploadType;


    // Check if fileIds is an array
    if (!Array.isArray(fileIds)) {
        return res.status(400).json({ error: 'fileIds must be an array' });
    }

    // Initialize an array to store promises for file deletions
    const deletePromises = [];
    let cursor
    for (const fileId of fileIds) {
        // Find the file by its ID
        try {
            cursor = bucket.find(new mongoose.Types.ObjectId(fileId));
        } catch (error) {


            return res.status(400).send('Invalid Object Id')
        }

        const file = await cursor.toArray()

        if (!file) {
            return res.status(404).json({ error: `File with ID ${fileId} not found` });
        }
        const deletePromise = bucket.delete(file?.[0]?._id);
        deletePromises.push(deletePromise);
    }

    try {
        // Wait for all file deletions to complete
        await Promise.all(deletePromises);

        // // Update the prescription to remove the specified uploadType
        await Prescription.findByIdAndUpdate(prescription_id, { $unset: { [uploadType]: 1 } }, { new: true });
        res.status(200).send('Files Removed');
    } catch (error) {


        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the files or updating the prescription' });
    }
};


const getDownload = async (req, res) => {
    const fileId = req.params.id;
  
    try {
        try {
            cursor = bucket.find(new mongoose.Types.ObjectId(fileId));
        } catch (error) {
        return res.status(400).send('Invalid Object Id')
        }

        const file = await cursor.toArray()
  
      const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
      
      downloadStream.on('error', (err) => {
        console.error('Error while opening download stream:', err);
        return res.status(500).json({ error: 'An error occurred' });
      });
  
      // Set the response headers to force download
      res.setHeader('Content-Type', file?.[0]?.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${file?.[0].filename}"`);
  
      downloadStream.pipe(res);
    } catch (error) {
      res.status(400).send('Could not get report')
    }
  }

module.exports = { UploadReport, deleteReport, getReport, getImage, deleteImages, getDownload }


