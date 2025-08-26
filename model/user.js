const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const {createTokenForUser} = require('../Services/Authentication');
const { log } = require("console");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: "/images/user-avatar.jpeg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPass

    next()
});

userSchema.static("matchPassword", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('user not found');
 
    const salt = user.salt;
    const hashedPass = user.password;

    const userProvideHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(userProvideHash !== hashedPass) throw new Error("incorrect password");
    const token = createTokenForUser(user);
    return token;
})

const user = model("user", userSchema);

module.exports = user;
