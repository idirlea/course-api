const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.send("Welcome to code school API");
});

module.exports = router;
