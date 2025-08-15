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
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const newFile = new File({
  user: req.user.id,
  fileName: req.file.originalname,
  fileId: uuidv4(),
  processedData: jsonData,
  analyses: [],
});


    await newFile.save();

    // Respond with the fileId and the parsed data
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


const saveAnalysis = async (req, res) => {
  const { fileId } = req.params;
  const { chartType, xAxis, yAxis } = req.body;

  try {
    const file = await File.findOne({ fileId, userId: req.user.id });
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
  saveAnalysis,
};
