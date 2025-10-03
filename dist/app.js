"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: "An error ocured" });
});
app.listen(3005);
