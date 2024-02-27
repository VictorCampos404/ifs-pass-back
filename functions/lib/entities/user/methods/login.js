"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const firebaseAdmin = require("firebase-admin");
const { validations } = require("../../../tools/validations");
const httpsRequest = require("request-promise");
const user = firebaseAdmin.firestore().collection("user");

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
                        response.status(400).send({
                            error: 'USERNAME_OR_PASSWORD_WRONG',
                        });
                    }

                    if (res.token !== null) {
                        const document = await user.doc(username).get();

                        if (document.exists) {

                            //GERAR NOSSO CUSTOM TOKEN

                            response.send({
                                token: res.token,
                                user: document.data(),
                            });
                        } else {
                            response.status(401).send({
                                error: 'FIRST_ACCESS',
                                moodleToken: res.token,
                            });
                        }

                        return;
                    }
                }
            ).catch(
                (err) => {
                    //DEU RUIM

                    response.status(400).send({
                        error: 'ERROR_TO_LOGIN',
                    });
                }
            );

        return;

    } catch (error) {
        response.status(500).send({
            error: 'ERROR_TO_LOGIN',
        });
    }



};

exports.login = login;
