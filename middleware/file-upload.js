const multer = require("multer");
const { v1: uuidv1 } = require("uuid");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileupload = multer({
  limit: 50000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const exten = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + "." + exten);
    },
    filefilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error("Invaid file type");
      cb(error, isValid);
    },
  }),
});

module.exports = fileupload;
