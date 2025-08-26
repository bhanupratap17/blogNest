const JWT = require("jsonwebtoken");

const SECRET = "$UPERMAN@123";

function createTokenForUser(user) {
  console.log("bhanuuserrr",user.fullName);
  const payload = {
    _id: user._id,
    email: user.email,
    profileImgUrl: user.profileImgUrl,
    role: user.role,
    fullName: user.fullName,
  };

  const token = JWT.sign(payload, SECRET);
  return token;
}

function validateUserToken(token) {
  const payload = JWT.verify(token, SECRET);
  return payload;
}


module.exports = {createTokenForUser, validateUserToken}