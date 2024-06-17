import { rateLimit } from "express-rate-limit";

const defaultMaxRequests = 100;
const defaultWindowMs = 15 * 60 * 1000; // 15 minutes

function limiter(maxRequests = defaultMaxRequests, windowMs = defaultWindowMs) {
  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message:
      "Sorry, you have exceeded the maximum number of requests allowed within the specified time period. Please wait a while before trying again.",
  });
}

export default limiter;
