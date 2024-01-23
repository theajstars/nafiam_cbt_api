"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnSuccessResponseObject = exports.UnauthorizedResponseObject = void 0;
exports.UnauthorizedResponseObject = {
    status: true,
    statusCode: 401,
    message: "Unauthorized Request",
};
const returnSuccessResponseObject = (message) => {
    return {
        status: true,
        statusCode: 200,
        message,
    };
};
exports.returnSuccessResponseObject = returnSuccessResponseObject;
//# sourceMappingURL=Misc.js.map