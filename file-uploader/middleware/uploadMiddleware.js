const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

// Wait for the mongoose connection to be established by server.js
const dbPromise = mongoose.connection.asPromise().then(conn => {
  return conn.db; 
});

const storage = new GridFsStorage({
  db: dbPromise,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });
module.exports = upload;
