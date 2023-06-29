const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const home = require("./routes/home");
const usersRouter = require("./routes/api/users.js");
const postsRouter = require("./routes/api/posts.js");
const commentsRouter = require("./routes/api/comments.js");
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use('/', home);
app.use('/api', [usersRouter, postsRouter, commentsRouter]);
app.use(express.static(`${__dirname}/`));


app.listen(PORT, () => {
    console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})