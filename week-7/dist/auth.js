"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = "Yashwanth14";
function auth(req, res, next) {
    const token = req.headers.authorization;
    const response = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
    if (response) {
        // @ts-ignore
        req.userId = token.userId;
        next();
    }
    else {
        res.status(403).send({
            message: "unauthorized"
        });
    }
}
