"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const defaultMaxRequests = 100;
const defaultWindowMs = 15 * 60 * 1000; // 15 minutes
function limiter(maxRequests = defaultMaxRequests, windowMs = defaultWindowMs) {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs: windowMs,
        max: maxRequests,
        message: "Sorry, you have exceeded the maximum number of requests allowed within the specified time period. Please wait a while before trying again.",
    });
}
exports.default = limiter;
