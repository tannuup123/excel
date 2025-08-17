const XLSX = require("xlsx");
const File = require("../models/File");
const { v4: uuidv4 } = require("uuid");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Read the sheet into a 2D array to manually find the header row
    const dataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

    if (!dataArray || dataArray.length === 0) {
        return res.status(400).json({ error: "The Excel sheet is empty." });
    }

    // ========== NEW LOGIC TO FIND HEADER ROW ==========
    // Function to count non-empty cells in a row
    const countNonEmpty = (row) => row.filter(cell => cell !== null && cell.toString().trim() !== '').length;

    let headerRowIndex = -1;
    let maxCols = 0;
    // Search within the first 15 rows to find the most likely header
    const searchLimit = Math.min(15, dataArray.length);

    for (let i = 0; i < searchLimit; i++) {
        const numCols = countNonEmpty(dataArray[i]);
        // A header should have at least 2 columns. This avoids single-cell title rows.
        if (numCols > maxCols && numCols > 1) {
            maxCols = numCols;
            headerRowIndex = i;
        }
    }

    // If no suitable header is found after searching, return an error
    if (headerRowIndex === -1) {
      return res.status(400).json({
        error: "Failed to automatically detect a valid header row. Please ensure the file has a clear header with at least two columns.",
      });
    }
    // =================================================

    const headers = dataArray[headerRowIndex];
    const rawData = dataArray.slice(headerRowIndex + 1);

    const jsonData = rawData.map(row => {
        const obj = {};
        headers.forEach((header, i) => {
            if (header && typeof header === 'string' && header.trim() !== '') {
                obj[header] = row[i];
            }
        });
        return obj;
    }).filter(obj => Object.keys(obj).length > 0);


    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return res.status(400).json({
        error: "No data found after the header row. Please check the file.",
      });
    }

    const newFile = new File({
      user: req.user.id,
      fileName: req.file.originalname,
      fileId: uuidv4(),
      processedData: jsonData,
      analyses: [],
    });

    await newFile.save();

    res.status(200).json({
      message: "File uploaded and processed successfully",
      fileId: newFile.fileId,
      data: jsonData,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Failed to process file." });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve files." });
  }
};

const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await File.findOne({ fileId: fileId, user: req.user.id });
        if (!file) {
            return res.status(404).json({ error: "File not found or access denied." });
        }
        res.status(200).json({ data: file.processedData });
    } catch (error) {
        console.error("Error retrieving file:", error);
        res.status(500).json({ error: "Failed to retrieve file." });
    }
};

const saveAnalysis = async (req, res) => {
  const { fileId } = req.params;
  const { chartType, xAxis, yAxis } = req.body;

  try {
    const file = await File.findOne({ fileId, user: req.user.id });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    file.analyses.push({ chartType, xAxis, yAxis });
    await file.save();

    res
      .status(200)
      .json({
        message: "Analysis saved successfully.",
        analyses: file.analyses,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to save analysis." });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  saveAnalysis,
};