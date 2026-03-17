const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfsBucket;

mongoose.connection.once('open', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

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
        if (!gfsBucket) return res.status(500).json({ error: 'Database not initialized' });
        const files = await gfsBucket.find().toArray();
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
        if (!gfsBucket) return res.status(500).json({ error: 'Database not initialized' });
        const { id } = req.params;
        const fileId = new mongoose.Types.ObjectId(id);
        const files = await gfsBucket.find({ _id: fileId }).toArray();
        
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        gfsBucket.openDownloadStream(fileId).pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Invalid file ID or file not found' });
    }
};

const deleteFile = async (req, res) => {
    try {
        if (!gfsBucket) return res.status(500).json({ error: 'Database not initialized' });
        const { id } = req.params;
        const fileId = new mongoose.Types.ObjectId(id);
        
        await gfsBucket.delete(fileId);
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
