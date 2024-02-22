"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseFunctions = require("firebase-functions");
const app_1 = require("./app");
exports.v1 = firebaseFunctions.https.onRequest(app_1.app);
