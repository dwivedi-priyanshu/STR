const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define destination folder based on file type
    if (file.fieldname === 'report') {
      cb(null, 'uploads/reports/');
    } else if (file.fieldname === 'ppt') {
      cb(null, 'uploads/ppts/');
    } else if (file.fieldname === 'certificate') {
      cb(null, 'uploads/certificates/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;