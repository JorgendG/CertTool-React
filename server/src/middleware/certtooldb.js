const mongoose = require("mongoose");

const certtoolScheme = new mongoose.Schema({
  md5: String,
  csrfile: String,
  keyfile: String,
  crtfile: String,
});

module.exports = mongoose.model("certtool", certtoolScheme);
