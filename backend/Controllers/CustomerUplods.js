const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { Customer } = require("../Models/CustomerModel");


require("dotenv").config()

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'reports'
        };
    },
});

const UploadReport = async (req, res) => {
    const patientId = req.params.patientId;
    const uploadType = req.params.uploadType

    if (['pictures', 'profile_image']?.includes(uploadType)) {
        const upload = multer({ storage }).array('images', 10); 
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                return res.status(500).json({ error: 'An error occurred while uploading the pictures' });
            }
            try {
                await Customer.findByIdAndUpdate(patientId, { [uploadType]: fileIds }, { new: true });

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
                await Customer.findByIdAndUpdate(patientId, { [uploadType]: req.file.id }, { new: true });
                return res.status(200).send('uploaded');
            } catch (error) {
                return res.status(500).json({ error: 'An error occurred while uploading the report' });
            }
        });
    }


}


const deleteReport = async (req, res) => {
    const file_id = req.params.id;
    const patientId = req.params.custid
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
                await Customer.findByIdAndUpdate(patientId, { $unset: { [uploadType]: 1 } }, { new: true });
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

        // Set appropriate response headers (content type and disposition)
        res.setHeader('Content-Type', 'application/pdf'); // Set the appropriate content type
        res.setHeader('Content-Disposition', `inline`); // Specify how the browser should handle the file

        // Pipe the download stream to the response
        downloadStream.pipe(res);
    } catch (error) {

	console.log(error)
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
    const patientId = req.params.custid;
    const uploadType = req.params.uploadType;

    if (!Array.isArray(fileIds)) {
        return res.status(400).json({ error: 'fileIds must be an array' });
    }
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
        await Promise.all(deletePromises);
        await Customer.findByIdAndUpdate(patientId, { $unset: { [uploadType]: 1 } }, { new: true });
        res.status(200).send('Files Removed');

    } catch (error) {


        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the files or updating the prescription' });
    }
};



const UploadExtenralReport = async (req, res) => {
    const patientId = req.params.patientId;
    const upload = multer({ storage }).array('file', 10); 
    const uploadType = 'externalUploads'

    upload(req, res, async (uploadErr) => {
        if (uploadErr) {
            return res.status(500).json({ error: 'An error occurred while uploading the pictures' });
        }
        try {
            const fileIds = req.files.map((file) => file.id);
            try {
                await Customer.findByIdAndUpdate(patientId, { [uploadType]: fileIds }, { new: true });    
                console.log('successfully updted')
            } catch (error) {
                console.log('any error', error)
            }
            
            return res.status(200).send('uploaded');
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'An error occurred while uploading the report' });
        }
    });
    
  }

module.exports = { UploadReport, deleteReport, getReport, getImage, deleteImages, UploadExtenralReport }


