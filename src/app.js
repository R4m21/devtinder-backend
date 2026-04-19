const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// app.use(route, route handler function1,...route handler functionN);
// app.use(route, rH1, rH2, rH3, rH4, rH5);
// app.use(route, [rH1, rH2, rH3, rH4, rH5]);
// app.use(route, rH1, rH2, [rH3, rH4], rH5);
// all are gives same response

const rH1 = (req, res, next) => {
  console.log("response 1");
  // res.send("response 1");
  next(); // its throwing error because server already send response and its again send the response then connection already closed
};

const rH2 = (req, res, next) => {
  console.log("response 2");
  // res.send("response 2");
  next();
};

const rH3 = (req, res, next) => {
  console.log("response 3");
  res.send("response 3");
  next();
};
const rH4 = (req, res, next) => {
  console.log("response 4");
  res.send("response 4");
  next();
};

app.use("/user", rH1, [rH2, rH3, rH4], (req, res, next) => {
  console.log("response 5");
  res.send("response 5"); // if already response is send then connection already closed then its throwing error in node console:-> Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  // next(); // its throwing error because server need next handler function, if response is not send then, so its showing error :-> Cannot GET /user
});

// case 1: if already server response send kr chuka hai uske bad next() call krte hai to aur next function nhi hai to vaha error nhi ayega vo proper work kareg but ye bad pratice hai.

// case 2: if already server response send kr chuka hai uske bad next() call krte hai to aur next function hai to uska code proper execute hoga aur uske age next() call krte hai to aur ke age ke ane wale function server reaponse nhi send kr rha hai to vo proper work karega without error ke. ye same case 1 ke jesa hoga. if you send again response then its throwing error:-> 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'.

// case 3: next() call nhi krte hai to age bhi chain of route hander hai to jata tak next function hua hai uske agen next() call nhi hua the route vahi me stop ho jayega server usko response send krne ki kosis karega if response send ka code to vahi se response send kr dega. aur response send nhi karega to vo infinite loop me chale jayega user wait kete rahega aur server pending request show karega.

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
