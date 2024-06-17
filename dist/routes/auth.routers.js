"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const auth_controllers_1 = __importDefault(require("../controllers/auth.controllers"));
const router = express_1.default.Router();
const mapRoutesToController = (routes) => {
    routes.forEach(({ method, path, controller }) => {
        switch (method) {
            case "GET":
                router.get(path, (0, asyncHandler_1.default)(controller));
                break;
            case "POST":
                router.post(path, (0, asyncHandler_1.default)(controller));
                break;
            default:
                router.all(path, (req, res) => {
                    res.status(405).json({
                        error: `HTTP method ${req.method} is not allowed for ${path}`,
                    });
                });
        }
    });
};
// Define routes
const routes = [
    {
        method: "POST",
        path: "/general/signup",
        controller: auth_controllers_1.default.signUpGeneralUser,
    },
    {
        method: "POST",
        path: "/login",
        controller: auth_controllers_1.default.login,
    },
];
mapRoutesToController(routes);
exports.default = router;
