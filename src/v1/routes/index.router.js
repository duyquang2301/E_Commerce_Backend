"use strict";

const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   return res.status(200).json({
//     message: "Wellcome back",
//   });
// });

router.use("/v1/api", require("./access"));

module.exports = router;
