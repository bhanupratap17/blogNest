// const { validateUserToken } = require("../Services/Authentication");

// function checkAuthenticationCookie(cookieName) {
//   return (req, res, next) => {
//     const tokenCookieValue = req.cookies?.[cookieName];
//     if (!tokenCookieValue) {
//       next();
//     }
//     try {
//       const userpayload = validateUserToken(tokenCookieValue);
//       req.user = userpayload;
//     } catch (error) {}
//     next();
//   };
// }

// module.exports = {
//     checkAuthenticationCookie,
// };

const { validateUserToken } = require("../Services/Authentication");

function checkAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies?.[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userpayload = validateUserToken(tokenCookieValue);
      req.user = userpayload;
    } catch (error) {
    console.error("Invalid token:", error.message);
    }
    next();
  };
}

module.exports = {
  checkAuthenticationCookie,
};