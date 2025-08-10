const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/verifyToken');
const File = require('../models/File');
const xlsx = require('xlsx');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all file history for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).select('fileName fileId uploadDate analyses').sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching file history:', error);
    res.status(500).json({ error: 'Failed to fetch file history.' });
  }
});

// Get a single file's data by its fileId
router.get('/:fileId', verifyToken, async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId, user: req.user.id });
    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }
    res.status(200).json({ data: file.processedData, fileName: file.fileName });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ error: 'Failed to fetch file data.' });
  }
});

// Upload Excel file and save to DB
router.post('/upload', verifyToken, upload.single('excelFile'), async (req, res) => {
  try {
    console.log('--- File Upload Attempt ---');
    if (!req.file) {
      console.log('Error: No file received.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log(`File received: ${req.file.originalname}`);

    // Read the Excel file buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    console.log('Excel file read successfully.');

    // Convert sheet to JSON
    const sheetAsArray = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    if (sheetAsArray.length === 0) {
      return res.status(400).json({ error: 'No data found in the Excel file.' });
    }
    
    // Find the header row
    let headerRowIndex = -1;
    let maxNonEmptyCells = 0;
    
    for (let i = 0; i < sheetAsArray.length; i++) {
      const row = sheetAsArray[i];
      const nonEmptyCells = row.filter(cell => cell != null && cell !== '').length;
      
      if (nonEmptyCells > maxNonEmptyCells) {
        maxNonEmptyCells = nonEmptyCells;
        headerRowIndex = i;
      }
    }
    
    if (headerRowIndex === -1) {
      return res.status(400).json({ error: 'Could not find a valid header row in the Excel file.' });
    }

    const headers = sheetAsArray[headerRowIndex];
    const dataRows = sheetAsArray.slice(headerRowIndex + 1);

    // Format the data into an array of objects
    const formattedData = dataRows.map(row => {
      let rowObject = {};
      headers.forEach((header, index) => {
        const key = header || `Column_${index + 1}`;
        rowObject[key] = row[index];
      });
      return rowObject;
    });

    console.log('Data processed successfully. Saving to database...');

    const { originalname } = req.file;
    const fileId = uuidv4();
    
    const newFile = new File({
      user: req.user.id,
      fileName: originalname,
      fileId,
      processedData: formattedData,
    });
    await newFile.save();
    console.log('File saved to database.');

    res.status(201).json({
      message: 'File uploaded and processed successfully',
      fileId,
      data: formattedData,
    });

  } catch (error) {
    console.error('File upload failed. Detailed error:', error);
    res.status(500).json({ error: 'File upload failed.' });
  }
});

// Save chart analysis to a specific file
router.post('/:fileId/analyze', verifyToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { chartType, xAxis, yAxis } = req.body;
    const file = await File.findOne({ fileId, user: req.user.id });
    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }
    file.analyses.push({ chartType, xAxis, yAxis });
    await file.save();
    res.status(200).json({ message: 'Analysis saved successfully!', file });
  } catch (error) {
    console.error('Error saving analysis:', error);
    res.status(500).json({ error: 'Failed to save analysis.' });
  }
});

module.exports = router;