const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
require("dotenv").config()


const getStorageRef = async () => {
    const client = new mongoose.mongo.MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const storage = new GridFsStorage({
      url: process.env.MONGO_URL,
      file: (req, file) => {
        return {
          filename: file.originalname,
          bucketName: 'reports'
        };
      },
    });

    const db = client.db(client.options.dbName);
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'reports' });

  
    return {storage:storage, bucket:bucket};
  };

module.exports = getStorageRef