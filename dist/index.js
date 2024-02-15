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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const student_1 = __importDefault(require("./src/routes/student"));
const lecturer_1 = __importDefault(require("./src/routes/lecturer"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, body_parser_1.default)({ extended: true }));
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    (0, student_1.default)(app);
    (0, admin_1.default)(app);
    (0, lecturer_1.default)(app);
    const genPassword = () => __awaiter(void 0, void 0, void 0, function* () {
        const saltRounds = 10;
        bcryptjs_1.default.genSalt(saltRounds, function (err, salt) {
            bcryptjs_1.default.hash("securePassword2024", salt, function (err, hash) {
                console.log(hash);
            });
        });
    });
    genPassword();
    // new Lecturer({
    //   id: Date.now().toString(),
    //   firstName: "Lord",
    //   lastName: "Braavosi",
    //   email: "me@theajstars.com",
    //   password: "$2a$10$l.V0HzLVySU5s2MOOZ4PWuydU5MFxIuNmV.CP.Bll2iNx0Ml7lD9S",
    //   rank: "Air Vice Marshal",
    // }).save();
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map