const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { afterUploadImage, uploadPost } = require("../controllers/post");

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      // 이미지.png -> 이미지날짜시간.png 만드는 과정
      const ext = path.extname(file.originalname); // 확장자 부분만 추출
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);

const upload2 = multer(); // upload와 설정이 달라서 새로 만듦
router.post("/", isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
