"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;

const express_1 = require("express");
const { login } = require("./methods/login");
const { createAccount } = require("./methods/create-account");

class UserRouter {

    constructor() {
        this.router = express_1.Router();

        this.router.post("/login", async (request, response) => login(request, response));
        this.router.post("/create-account", async (request, response) => createAccount(request, response));

    }
}

exports.UserRouter = UserRouter;