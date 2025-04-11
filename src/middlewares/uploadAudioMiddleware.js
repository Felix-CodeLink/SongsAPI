const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if(fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new Error("Tipo de arquivo invalido"), false);
    }
};

const uploadAudio = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 20*1024*1024,
    },
});

module.exports = uploadAudio;