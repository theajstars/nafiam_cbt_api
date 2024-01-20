"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const Student_1 = require("./src/models/Student");
const app = (0, express_1.default)();
(0, mongoose_1.connect)("mongodb://127.0.0.1:27017/nafiam_cbt")
    .then(() => {
    const student = new Student_1.Student({
        firstName: "Lord",
        lastName: "Braavosi",
        email: "atajiboyeo@gmail.coms",
    });
    student.save();
    app.listen(8080, () => console.log("Server started!"));
    app.get("/create", () => { });
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map