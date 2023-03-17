const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g); // 해시태그 정규표현식. \s는 공백을 의미
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            // 있으면 가져오고 없으면 생성
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      console.log("result", result); // [[모델, bool], [모델, bool], [모델, bool]] bool은 이미 있는 해시태그면 false, 없으면 true
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
