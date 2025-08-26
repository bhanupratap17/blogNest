const { Router } = require("express");
const User = require("../model/user");
const multer = require("multer");
const path = require("path"); 


const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/profileImg")); 
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPassword(email, password);
    console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "incorrect error and password" });
  }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", upload.single("userImage"), async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("sign up", req.body);

  await User.create({
    fullName,
    email,
    password,
    userImage: req.file
      ? `/profileImg/${req.file.filename}` 
      : "/images/user-avatar.jpeg", 
  });

  return res.redirect("/user/signin");
});

router.get('/logout',(req,res)=>{
  res.clearCookie('token').redirect('/');
})

module.exports = router;
