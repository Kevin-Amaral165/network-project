"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core
const express_1 = __importDefault(require("express"));
// Libraries
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Routes
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
// Load environment variables from the .env file
dotenv_1.default.config();
// Check if JWT_SECRET is defined; exit the app if not
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}
// Initialize the Express server
const app = (0, express_1.default)();
// Define the server port (default to 3001 if not specified)
const PORT = process.env.PORT || 3001;
// =======================
// Middlewares
// =======================
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// =======================
// Routes
// =======================
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.get('/', (req, res) => {
    res.send('Backend is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
