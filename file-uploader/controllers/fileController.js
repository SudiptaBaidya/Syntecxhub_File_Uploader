const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfsBucket;

const getBucket = () => {
    if (gfsBucket) return gfsBucket;
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        gfsBucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
        return gfsBucket;
    }
    return null;
};

const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(201).json({
        message: 'File uploaded successfully',
        file: req.file
    });
};

const getFiles = async (req, res) => {
    try {
        const bucket = getBucket();
        if (!bucket) return res.status(500).json({ error: 'Database not initialized' });
        const files = await bucket.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files found' });
        }
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFile = async (req, res) => {
    try {
        const bucket = getBucket();
        if (!bucket) return res.status(500).json({ error: 'Database not initialized' });
        const { id } = req.params;
        const fileId = new mongoose.Types.ObjectId(id);
        const files = await bucket.find({ _id: fileId }).toArray();
        
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        bucket.openDownloadStream(fileId).pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Invalid file ID or file not found' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const bucket = getBucket();
        if (!bucket) return res.status(500).json({ error: 'Database not initialized' });
        const { id } = req.params;
        const fileId = new mongoose.Types.ObjectId(id);
        
        await bucket.delete(fileId);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'File not found or invalid ID' });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    getFile,
    deleteFile
};
