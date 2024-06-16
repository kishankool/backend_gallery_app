const router = require("express").Router();
const { uploadFile, listFiles, upload } = require("../controllers/media");

router.post("/upload/:userId", upload, uploadFile);
router.get("/getMedia/:userId", listFiles);

module.exports = router;
