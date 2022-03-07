const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required:true,unique: true},
  parentfolder: { type: String, default: null },
  ownerid: { type: String, required:true }
});

module.exports = mongoose.model("folder", folderSchema);