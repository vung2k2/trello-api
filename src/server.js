const express = require("express");

const app = express();

const hostname = "localhost";

const port = 8017;

app.get("/", function (req, res) {
  res.send("ok");
});

app.listen(port, hostname, () => {
  console.log(`Server đang chạy tại http://${hostname}:${port}`);
});
