"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const firebaseAdmin = require("firebase-admin");
const user = firebaseAdmin.firestore().collection("user");

const login = async (request, response) => {

    response.json({
        message: 'hello world!',
    });

};

exports.login = login;
