const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const path = require('path') // inbuild package in node - to get extension of a file.


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/uploads"); // providing path where our uploads will be stored
  },
  filename: function (req, file, callback) {
    const uniqueName = uuidv4();
    callback(null, uniqueName + path.extname(file.originalname));  // providing the unique name to each file which will be created
  },
});

const upload = multer({ storage: storage });


module.exports = upload;
