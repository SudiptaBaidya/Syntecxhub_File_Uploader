const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
    uploadFile,
    getFiles,
    getFile,
    deleteFile
} = require('../controllers/fileController');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

module.exports = router;
