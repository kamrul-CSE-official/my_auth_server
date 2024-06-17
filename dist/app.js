"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const limiter_1 = __importDefault(require("./middleware/limiter"));
const user_routers_1 = __importDefault(require("./routes/user.routers"));
const auth_routers_1 = __importDefault(require("./routes/auth.routers"));
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Root route handler
app.get("/", (0, limiter_1.default)(5), (req, res) => {
    res.send("Server is running...🏃");
});
// API routes
app.use("/api/v1/users", user_routers_1.default);
app.use("/api/v1/auth", auth_routers_1.default);
// Error handlers
app.use((req, res, next) => {
    const err = new Error("Requested URL was not found!");
    console.error("Requested URL:", req.url);
    next(err);
});
app.use((err, req, res, next) => {
    res
        .status(500)
        .json({ status: "fail", message: err.message || "Internal Server Error" });
});
exports.default = app;
