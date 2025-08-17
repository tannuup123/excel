const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const File = require("../models/File"); 
const verifyToken = require("../middleware/verifyToken");
const { getFile, uploadFile, getFiles, saveAnalysis } = require('../controllers/fileController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/files — Get history for logged-in user
router.get("/", verifyToken, getFiles);

// GET /api/files/:fileId — Get a specific file's data
router.get("/:fileId", verifyToken, getFile);

// POST /api/files/upload — Upload new Excel file
router.post("/upload", verifyToken, upload.single('excelFile'), uploadFile);

// POST /api/files/:fileId/analyze — Save a chart analysis for a file
router.post("/:fileId/analyze", verifyToken, saveAnalysis);
module.exports = router;