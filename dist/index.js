"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./configs/database"));
const envConfig_1 = __importDefault(require("./configs/envConfig"));
const PORT = envConfig_1.default.port || 3001;
// Connect to the database
(0, database_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT} 🏃...`);
    });
})
    .catch((error) => {
    console.error("Database connection error ⚠️:", error?.message);
    process.exit(1);
});
