const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required:true ,unique: true},
  content: { type: String, default: null },
  parentfolder: { type: String,default:null },
  ownerid: { type: String, required:true }
});

module.exports = mongoose.model("file", fileSchema);