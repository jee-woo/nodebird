const express = require("express");
const router = express.Router();
const {
  renderJoin,
  renderMain,
  renderProfile,
  renderHashtag,
} = require("../controllers/page");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

router.use((req, res, next) => {
  // 라우터들에서 공통적으로 쓰길 원하는 데이터를 넣어둘 수 있음.
  res.locals.user = req.user; // passport
  res.locals.followerCount = req.user?.Followers.length || 0;
  res.locals.followingCount = req.user?.Followings.length || 0;
  res.locals.followingIdList = req.user?.Followings.map((f) => f.id) || [];
  next();
});

// renderProfile과 같은 미들웨어: controller
router.get("/profile", isLoggedIn, renderProfile); // 로그인한 사람만 렌더링
router.get("/join", isNotLoggedIn, renderJoin); // 로그인 안 한 사람만 렌더링
router.get("/", renderMain);
router.get("/hashtag", renderHashtag); // hashtag?hashtag=고양이 (req.query.hashtag === 고양이)

module.exports = router;
