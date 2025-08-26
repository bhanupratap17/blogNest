require("dotenv").config();
const path = require("path");
const express = require("express");
const Blog = require("./model/blog");
const cookieParser = require("cookie-parser");
const { checkAuthenticationCookie } = require("./middleware/authentication");
const { connectionMongoDB } = require("./connectiondb");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

connectionMongoDB(process.env.MONGO_URL);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));
app.use(express.static('public'))

app.get("/", async (req, res) => {
  const allblog = await Blog.find({}).sort({ createdAt: -1 });
  console.log("userrrr",req.user);
  res.render("home", {
    user: req.user,
    blogs: allblog,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`server started at PORT:${PORT}`);
});
