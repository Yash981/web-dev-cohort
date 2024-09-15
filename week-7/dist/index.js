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
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
mongoose_1.default.connect('mongodb://localhost:27017/');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/week-7/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    yield db_1.UserModel.create({
        username,
        password,
        email
    });
    res.send("Welcome " + username);
}));
app.post('/week-7/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const response = yield db_1.UserModel.findOne({
        email,
        password
    });
    if (response) {
        const token = jsonwebtoken_1.default.sign({
            id: response._id.toString()
        }, auth_1.JWT_SECRET);
        res.send({
            token
        });
    }
    else {
        res.status(403).send({
            message: "Invalid username or password"
        });
    }
}));
app.get('/week-7/todos', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const response = yield db_1.TodosModel.find({
        userId
    });
    res.json(response);
}));
app.post('/week-7/todos', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const done = req.body.done;
    yield db_1.TodosModel.create({
        userId,
        title,
        description,
        done
    });
    res.status(200).send("Todo created successfully");
}));
app.listen(3000, () => console.log("server is running"));
