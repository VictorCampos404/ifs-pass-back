"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
//const { Timestamp } = require("firebase/firestore");
const firebaseAdmin = require("firebase-admin");
const { validations } = require("../../../tools/validations");
const httpsRequest = require("request-promise");
const user = firebaseAdmin.firestore().collection("user");




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
            response.status(400).send({
                error: "USER_ALREADY_EXISTS"
            });
            return;

        }

        if (!permissionToSaveData) {

            response.status(400).send({
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
                    response.status(400).send({
                        error: 'INVALID_MOODLE_TOKEN',
                    });
                    return;
                }
                if (Object.keys(res).length === 0) {
                    response.status(400).send({
                        error: 'INVALID_USERNAME',
                    });
                    return;
                }

                if (res.id !== null) {
                    const account = {

                        username: res[0].username,
                        fullname: res[0].fullname,
                        email: res[0].email,
                        city: res[0].city,
                        country: res[0].country,
                        moodlephoto: res[0].profileimageurl,
                        customphoto: null,
                        active: true,
                        //createdAt: Timestamp.fromDate(new Date()),

                    }
                    await user.doc(username).create(account);
                    response.status(200).send({
                        status: 'ACCOUNT_CREATED',
                    });
                    return;

                }



            }


            )



    }
    catch (error) {
        response.status(500).send({
            error: 'ERROR_TO_CREATE_ACCOUNT',
            test: error
        });
        return;


    }





};

exports.createAccount = createAccount;
