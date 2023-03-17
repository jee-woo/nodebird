const express = require("express");
const router = express.Router();
const {
  renderJoin,
  renderMain,
  renderProfile,
} = require("../controllers/page");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

router.use((req, res, next) => {
  // 라우터들에서 공통적으로 쓰길 원하는 데이터를 넣어둘 수 있음.
  res.locals.user = req.user; // passport
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
});

// renderProfile과 같은 미들웨어: controller
router.get("/profile", isLoggedIn, renderProfile); // 로그인한 사람만 렌더링
router.get("/join", isNotLoggedIn, renderJoin); // 로그인 안 한 사람만 렌더링
router.get("/", renderMain);

module.exports = router;
