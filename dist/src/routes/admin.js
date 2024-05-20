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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = require("../models/Admin");
const JWT_1 = require("../Lib/JWT");
const Misc_1 = require("../Lib/Misc");
const Student_1 = require("../models/Student");
const Methods_1 = require("../Lib/Methods");
const admin_1 = require("../validation/admin");
const course_1 = require("../validation/course");
const default_1 = require("../validation/default");
const Log_1 = require("../models/Log");
const admin_2 = require("../validation/admin");
const Instructor_1 = require("../models/Instructor");
const basePath = "/admin";
function default_2(app) {
    app.post(`${basePath}/login`, default_1.validateLoginRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password, navigatorObject } = req.body;
        const admin = yield Admin_1.Admin.findOne({
            $or: [{ serviceNumber: id }, { email: id }],
        });
        if (admin) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, admin.password);
            yield new Log_1.Log({
                id: (0, Methods_1.generateRandomString)(32),
                personnelID: admin.id,
                userType: "admin",
                action: "login",
                navigatorObject: navigatorObject,
                comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
                timestamp: Date.now(),
                status: isPasswordCorrect ? "success" : "error",
            }).save();
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                token: isPasswordCorrect ? yield (0, JWT_1.createToken)(admin.id, "admin") : null,
            });
        }
        else {
            res.json({
                status: true,
                message: "Password and ID combination not found!",
                statusCode: 401,
            });
        }
    }));
    app.post(`${basePath}/profile/get`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const admin = yield Admin_1.Admin.findOne({ id }).select("id firstName lastName email superUser rank serviceNumber dateCreated isChangedPassword school");
            res.json({
                status: true,
                statusCode: 200,
                data: admin,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/profile/update`, default_1.validateDefaultProfileUpdateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, firstName, lastName, email, serviceNumber, rank } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const admin = yield Admin_1.Admin.findOneAndUpdate({ id }, {
                firstName,
                lastName,
                email,
                serviceNumber: serviceNumber !== null && serviceNumber !== void 0 ? serviceNumber : undefined,
                rank: rank !== null && rank !== void 0 ? rank : undefined,
            });
            res.json({
                status: true,
                statusCode: 200,
                data: admin,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}s/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const admins = yield Admin_1.Admin.find({}).select("id firstName lastName email rank serviceNumber isChangedPassword superUser dateCreated school");
            res.json({
                status: true,
                statusCode: 200,
                data: admins,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/create`, admin_1.validateCreateAdminRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, firstName, lastName, email, serviceNumber, rank, school } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            //Check if Admin already exists
            const adminExists = yield Admin_1.Admin.findOne({
                $or: [{ email }, { serviceNumber }],
            });
            if (adminExists && adminExists.id) {
                res.json({
                    status: true,
                    message: "Email or Service number for admin already exists!",
                    statusCode: 409,
                });
            }
            else {
                const password = yield (0, Methods_1.genPassword)(lastName.toUpperCase());
                const admin = yield new Admin_1.Admin({
                    id: (0, Methods_1.generateRandomString)(32),
                    firstName,
                    lastName,
                    email,
                    serviceNumber: serviceNumber === null || serviceNumber === void 0 ? void 0 : serviceNumber.toUpperCase(),
                    rank,
                    password,
                    dateCreated: Date.now(),
                    superUser: false,
                    isChangedPassword: false,
                    school: school !== null && school !== void 0 ? school : "",
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    data: admin,
                    message: "Admin created!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/update`, admin_1.validateUpdateAdminRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { adminID, token, firstName, lastName, email, serviceNumber, rank, school, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            //Check if other admin has email or service number
            const adminExistsWithPersonalInformation = yield Admin_1.Admin.findOne({
                $or: [{ email }, { serviceNumber }],
            });
            if (adminExistsWithPersonalInformation &&
                adminExistsWithPersonalInformation.id &&
                adminExistsWithPersonalInformation.id === adminID) {
                //Admin with information is admin to be modified
                const admin = yield Admin_1.Admin.findOneAndUpdate({ id: adminID }, {
                    token,
                    firstName,
                    lastName,
                    email,
                    serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
                    school,
                    rank,
                });
                res.json({
                    status: true,
                    statusCode: 200,
                    data: admin,
                    message: "Admin profile updated!",
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 409,
                    message: "Duplicate record found!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/verify_token`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const admin = yield Admin_1.Admin.findOne({ id });
            if (admin !== null && admin.id) {
                res.json({
                    status: true,
                    statusCode: 200,
                    data: admin,
                    message: "Verified successfully!",
                });
            }
            else {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
        }
    }));
    app.post("/admin/student/onboard", admin_1.validateOnboardStudent, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, email, firstName, lastName, rank, gender, role, serviceNumber, school, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const studentExists = yield Student_1.Student.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (!studentExists) {
                const saltRounds = 10;
                const salt = yield bcryptjs_1.default.genSalt(saltRounds);
                const hash = yield bcryptjs_1.default.hash(lastName.toUpperCase(), salt);
                const student = yield new Student_1.Student({
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
                    gender,
                    isChangedPassword: false,
                    password: hash,
                    dateCreated: Date.now(),
                    school,
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    data: student,
                    message: "New Student created",
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: false,
                    message: "Student exists!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/student/update`, admin_1.validateUpdateStudent, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { studentID, token, email, firstName, lastName, rank, gender, school, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const studentExists = yield Student_1.Student.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (studentExists && studentExists.id !== studentID) {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: { id: studentExists.id, studentID },
                    message: "Student exists!",
                });
            }
            else {
                const student = yield Student_1.Student.findOneAndUpdate({ id: studentID }, {
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
                    gender,
                    school,
                    // school,
                });
                res.json({
                    status: true,
                    statusCode: 200,
                    data: student,
                    message: "Student updated",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post("/admin/students/get", course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const students = yield Student_1.Student.find({});
            res.json({
                data: students,
                status: true,
                statusCode: 200,
                message: "Students found!",
            });
        }
    }));
    app.post("/admin/getStudent/:studentID", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const studentID = req.params.studentID;
        const v = (0, JWT_1.verifyToken)(body.token);
        if (!body || !body.token || v.user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const student = yield Student_1.Student.findOne({ id: studentID });
            res.json({
                data: student,
                status: true,
                statusCode: student ? 200 : 404,
            });
        }
    }));
    app.delete("/admin/student/:studentID", course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { studentID } = req.params;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const student = yield Student_1.Student.findOneAndDelete({ id: studentID });
            res.json({
                data: student,
                status: true,
                statusCode: 204,
                message: "Student deleted!",
            });
        }
    }));
    //INSTRUCTORS FUNCTIONALITY
    app.post(`${basePath}/instructor/create`, admin_2.validateCreateInstructor, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, email, firstName, lastName, rank, school, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const instructorExists = yield Instructor_1.Instructor.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            console.log({ ment: instructorExists });
            if (!instructorExists || serviceNumber.length === 0) {
                const saltRounds = 10;
                const salt = yield bcryptjs_1.default.genSalt(saltRounds);
                const hash = yield bcryptjs_1.default.hash(lastName.toUpperCase(), salt);
                const instructor = yield new Instructor_1.Instructor({
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    school,
                    role,
                    serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
                    gender,
                    password: hash,
                    dateCreated: Date.now(),
                    isChangedPassword: false,
                    // school,
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    data: instructor,
                    message: "New Instructor created",
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: false,
                    message: "Instructor exists!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/instructor/update`, admin_2.validateUpdateInstructor, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { instructorID, token, email, firstName, lastName, rank, school, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const instructorExists = yield Instructor_1.Instructor.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (instructorExists && instructorExists.id !== instructorID) {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: { id: instructorExists.id, instructorID },
                    message: "Instructor exists!",
                });
            }
            else {
                const instructor = yield Instructor_1.Instructor.findOneAndUpdate({ id: instructorID }, {
                    email,
                    firstName,
                    lastName,
                    rank,
                    school,
                    role,
                    serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
                    gender,
                });
                res.json({
                    status: true,
                    statusCode: 200,
                    data: instructor,
                    message: "Instructor updated",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/instructor/get`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, instructorID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user === "admin") {
            const instructor = yield Instructor_1.Instructor.findOne({ id: instructorID }).select("email firstName lastName id rank gender serviceNumber role school");
            res.json({
                status: true,
                statusCode: 200,
                data: instructor,
                message: "Profile successfully retrieved!",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.delete(`${basePath}/instructor/delete`, admin_1.validateSingleInstructorRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, instructorID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const instructor = yield Instructor_1.Instructor.findOneAndDelete({
                id: instructorID,
            });
            res.json({
                status: true,
                statusCode: 200,
                data: instructor,
                message: "Profile successfully deleted!",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/instructors/all/get`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const instructors = yield Instructor_1.Instructor.find({}).select("email firstName lastName id rank gender role serviceNumber school");
            res.json({
                status: true,
                statusCode: 200,
                data: instructors,
                message: "Instructors retrieved!",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=admin.js.map