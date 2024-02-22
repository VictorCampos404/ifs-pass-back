"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const firebaseAdmin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
firebaseAdmin.initializeApp();

const user_1 = require("./entities/user");

const app = express();
exports.app = app;
app.use(cors());
app.use(express.json());

const userRouter = new user_1.UserRouter();

app.use('/user', userRouter.router);