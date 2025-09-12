const mongoose = require("mongoose");
const settingSchema = new mongoose.Schema(
    {
        maxFileSize: { type: Number, default: 50 },
        acceptedFormats: { type: String, default: ".xlsx, .xls" },
        dataRetentionPolicy: { type: String, default: "1 year" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);