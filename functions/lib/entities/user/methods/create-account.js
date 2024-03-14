"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const firebaseAdmin = require("firebase-admin");
const responseCode_1 = require("../../../tools/responseCode");
const { validations } = require("../../../tools/validations");
const { Timestamp } = require('firebase-admin/firestore');
const httpsRequest = require("request-promise");
const user = firebaseAdmin.firestore().collection("users");




const createAccount = async (request, response) => {
    const validation = validations.haveParamsInBody(['moodleToken', 'permissionToSaveData', 'username'], request.body);
    if (!validation.status) {

        response.json({
            error: validation.message,
        });

        return;
    }
    try {

        const moodleToken = request.body.moodleToken;
        const permissionToSaveData = request.body.permissionToSaveData;
        const username = request.body.username;
        const url = `https://moodle.slt.ifsp.edu.br/webservice/rest/server.php?wstoken=` + moodleToken + `&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=username&values[0]=` + username;

        const document = await user.doc(username).get();
        if (document.exists) {
            response.status(responseCode_1.ResponseCode.BadRequest).send({
                error: "USER_ALREADY_EXISTS"
            });
            return;

        }

        if (!permissionToSaveData) {

            response.status(responseCode_1.ResponseCode.BadRequest).send({
                error: "PERMISSION_DENIED_TO_SAVE_DATA"
            })
            return;

        }

        const options = {
            url: url,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            json: true,

        };

        httpsRequest(options)
            .then(async res => {
                if (res.errorcode === "invalidtoken") {
                    response.status(responseCode_1.ResponseCode.BadRequest).send({
                        error: 'INVALID_MOODLE_TOKEN',
                    });
                    return;
                }
                if (Object.keys(res).length === 0) {
                    response.status(responseCode_1.ResponseCode.BadRequest).send({
                        error: 'INVALID_USERNAME',
                    });
                    return;
                }

                if (res.id !== null) {
                    const createdAt = Timestamp.now();

                    const account = {

                        username: res[0]?.username ?? null,
                        fullname: res[0]?.fullname ?? null,
                        email: res[0]?.email ?? null,
                        city: res[0]?.city ?? null,
                        country: res[0]?.country ?? null,
                        moodlePhoto: res[0]?.profileimageurl ?? null,
                        customPhoto: null,
                        active: true,
                        createdAt: createdAt,

                    }

                    await user.doc(username).create(account);
                    response.send({
                        status: 'ACCOUNT_CREATED',
                    });
                    return;

                }
            }).catch(
                (err) => {
                    response.status(responseCode_1.ResponseCode.BadRequest).send({
                        error: 'ERROR_TO_CREATE_ACCOUNT',
                    });
                    return;
                }
            );


    }
    catch (error) {
        response.status(responseCode_1.ResponseCode.InternalServerError).send({
            error: 'ERROR_TO_CREATE_ACCOUNT',
            test: error
        });
        return;
    }
};

exports.createAccount = createAccount;
