const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/nodeLogin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((value) => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
