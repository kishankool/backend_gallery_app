const router = require("express").Router();
const multer = require("multer");
const { uploadFile, listFiles } = require("../controllers/media");


router.get("/uploadMedia/:userId", uploadFile);
router.get("/getMedia", listFiles);

module.exports = router;
