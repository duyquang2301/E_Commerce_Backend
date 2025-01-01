'use strict';

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "opt_log";
const COLLECTION_NAME = "otp_logs";

const optSchema = new Schema({
    opt_token: { type: String, required: true },
    opt_email: { type: String, required: true },
    opt_status: { type: String, default: "active", enum: ["active", "block", "pending"] },
    expiredAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, optSchema)