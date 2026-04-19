const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// ye route ek switch statement kese work krta hai vo exect. path match krta hai usko milne ke bad vahi se response send krne ke kosis karta yadi response nhi bhej rha hai aur vo next function kiya hai to vo next functioon ko age bad ke uske associated route ko trigger krta hai.

// 2. app.use WITH PATH - yah /user se suru hone vale all route pe chalega cheye ye get post put...delete ho. ye age ke sabhi route pe chalega jese ki /user/123
app.use("/user", (req, res) => {
  res.status(400); // ise status code set hota hai response send krne pe user ko response milega direct status code set krne se nhi.
  res.send("response done");
});

// 3. app.all - yeh sirf '/secret' route pe hi chalega ye  all route pe chalega chaye ye get post put...delete ho but jese ki /secret/123 ispe nhi chalega
app.all("/secret", (req, res) => {
  res.send("You accessed the secret route with " + req.method);
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
