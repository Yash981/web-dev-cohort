"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const objectId = Schema.ObjectId;
const userSchema = new Schema({
    username: String,
    password: String,
    email: { type: String, unique: true }
});
const TodosSchema = new Schema({
    userId: objectId,
    title: String,
    description: String,
    done: Boolean
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
exports.TodosModel = mongoose_1.default.model('Todos', TodosSchema);
