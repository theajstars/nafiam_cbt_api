"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const Student_1 = require("./src/models/Student");
const app = (0, express_1.default)();
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
console.log(process.env.PORT);
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            status: true,
            message: "Connected Successfully!",
        });
    }));
    app.get("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const student = new Student_1.Student({
            firstName: "Lord",
            lastName: "Braavosi",
            email: "me@theajstars.com",
        });
        res.json({
            data: yield Student_1.Student.find(),
        });
        // return await student.save();
    }));
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map