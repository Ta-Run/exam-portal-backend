const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const uploadDir = path.resolve(__dirname, "../../../../public/upload/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      //   req.user.id + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Optional: add file type validation here
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // Optional: limit file size to 10MB
  },
});

const singleFileUpload = (fieldName) => upload.single(fieldName);

const multiFieldsUpload = (fieldsArray) => upload.fields(fieldsArray);

module.exports = {
  singleFileUpload,
  multiFieldsUpload,
};
