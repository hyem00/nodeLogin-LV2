const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

//사용자인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  //undefined.split = err
  // authorization 쿠키가 존재하지 않았을 때를 대비
  const [authType, authToken] = (Authorization ?? "").split(" "); // ?? = 왼쪽에 있는 값이 비었거나 null일 경우에 오른쪽에 있는 값으로 대체

  // authType == Bearer 값인지 확인
  // authToken 검증
  if (authType !== "Bearer" || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다.",
    });
    return;
  }

  // jwt 검증
  try {
    // authToken이 만료되었는지 확인
    // authToken이 서버가 발급한 토큰이 맞는지 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");

    // authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);
    res.locals.user = user;

    next(); // 이 미들웨어 다음으로 보낸다.
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ errorMessage: "로그인 후에 이용할 수 있는 기능입니다." });
    return;
  }
};
