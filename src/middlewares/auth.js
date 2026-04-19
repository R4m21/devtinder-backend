const adminAuth = (req, res, next) => {
  console.log("admin auth");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

const userAuth = (req, res, next) => {
  console.log("user auth");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
