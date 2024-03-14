"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const firebaseAdmin = require("firebase-admin");
const responseCode_1 = require("../../../tools/responseCode");
const { validations } = require("../../../tools/validations");
const httpsRequest = require("request-promise");
const { tokenManager } = require("../../../tools/token_manager");
const { jwtDecode } = require("jwt-decode");
const user = firebaseAdmin.firestore().collection("users");

const login = async (request, response) => {

    const validation = validations.haveParamsInBody(['username', 'password'], request.body);

    if (!validation.status) {

        response.json({
            error: validation.message,
        });

        return;
    }

    try {

        const username = request.body.username;
        const password = request.body.password;
        const url = "https://moodle.slt.ifsp.edu.br/login/token.php?service=moodle_mobile_app";

        const options = {
            url: url,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            json: true,
            formData: {
                username: username,
                password: password,
            }
        };

        httpsRequest(options)
            .then(
                async (res) => {

                    if (res.errorcode === "invalidlogin") {
                        response.status(responseCode_1.ResponseCode.BadRequest).send({
                            error: 'USERNAME_OR_PASSWORD_WRONG',
                        });
                        return;
                    }

                    if (res.token !== null) {
                        const document = await user.doc(username).get();

                        if (document.exists) {

                            const userData = document.data();
                            const token = await tokenManager.createToken(userData, res.token);

                            response.send({
                                token: token,
                                user: {
                                    username: userData?.username,
                                    fullname: userData?.fullname,
                                    email: userData?.email,
                                    city: userData?.city,
                                    country: userData?.country,
                                    moodlePhoto: userData?.moodlePhoto,
                                    customPhoto: userData?.customPhoto,
                                    active: userData?.active,
                                    createdAt: userData?.createdAt.toDate(),
                                },
                            });
                        } else {
                            response.status(responseCode_1.ResponseCode.Unauthorized).send({
                                error: 'FIRST_ACCESS',
                                moodleToken: res.token,
                            });
                        }

                        return;
                    }
                }
            ).catch(
                (err) => {
                    response.status(responseCode_1.ResponseCode.BadRequest).send({
                        error: 'ERROR_TO_LOGIN',
                    });
                    return;
                }
            );


    } catch (error) {
        response.status(responseCode_1.ResponseCode.InternalServerError).send({
            error: 'ERROR_TO_LOGIN',
        });
        return;
    }



};

exports.login = login;
