"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const { authentication } = require("../auth/authUtil");
const router = express.Router();

// router.get("/", (req, res) => {
//   return res.status(200).json({
//     message: "Wellcome back",
//   });
// });

// check api key
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/profiles", require("./profile"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/", require("./upload"));
router.use("/v1/api/notification", require("./notification"));

router.use("/v1/api", require("./access"));

module.exports = router;  
