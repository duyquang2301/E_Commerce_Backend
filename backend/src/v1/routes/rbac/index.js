"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { newRole, listRole, newResources, listResources } = require("../../controllers/rbac.controlller");
const router = express.Router();

router.post("/role", asyncHandler(newRole))
router.get("/roles", asyncHandler(listRole))

router.post("/resource", asyncHandler(newResources))
router.get("/resources", asyncHandler(listResources))

module.exports = router;
