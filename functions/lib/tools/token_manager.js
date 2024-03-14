"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenManager = void 0;

const firebaseAdmin = require("firebase-admin");
const { Timestamp } = require('firebase-admin/firestore');
const CryptoJS = require('crypto-js');
const { jwtDecode } = require("jwt-decode");
const tokenCollection = firebaseAdmin.firestore().collection("tokens");
const userCollection = firebaseAdmin.firestore().collection("users");

class TokenManager {

    async createToken(user, moodleToken) {

        const username = user?.username;
        const fullname = user?.fullname;

        const activedToken = await tokenCollection.where('username', '==', username).get();

        if (!activedToken.empty) {
            const tokenData = activedToken.docs[0].data();

            if (tokenData.expireAt.toDate() < Timestamp.now().toDate()) {
                await this.deleteToken(tokenData?.token);
            } else {
                return tokenData.token;
            }
        }

        const createdAt = Timestamp.now();
        const expireAt = Timestamp.fromDate(createdAt.toDate().addHours(5));

        const tokenHeader = {
            "alg": "HS256",
            "typ": "JWT"
        };

        const tokenBody = {
            username: username,
            fullname: fullname,
            moodleToken: moodleToken,
            createdAt: createdAt,
            expireAt: expireAt,
        };

        var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(tokenHeader));
        var encodedHeader = base64url(stringifiedHeader);

        var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(tokenBody));
        var encodedData = base64url(stringifiedData);

        const token = encodedHeader + "." + encodedData;


        await tokenCollection.add(
            {
                token: token,
                username: username,
                createdAt: createdAt,
                expireAt: expireAt,
            },
        );

        return token;


    }

    async isValidToken(token) {

        if (token === null) {
            return {
                'status': false,
                'message': 'INVALID_TOKEN'
            }
        }

        const tokenBody = jwtDecode(token);
        const username = tokenBody?.username;

        const activedToken = await tokenCollection.where('username', '==', username).get();

        if (!activedToken.empty) {
            const tokenData = activedToken.docs[0].data();

            if (token !== tokenData?.token) {
                return {
                    'status': false,
                    'message': 'INVALID_TOKEN'
                }
            }

            if (tokenData.expireAt.toDate() < Timestamp.now().toDate()) {
                await this.deleteToken(token);
                return {
                    'status': false,
                    'message': 'INVALID_TOKEN'
                }
            } else {

                const username = tokenData?.username;

                const userDoc = await userCollection.doc(username).get();
                const userData = userDoc.data();

                return {
                    'status': true,
                    'user': {
                        username: userData?.username,
                        fullname: userData?.fullname,
                        email: userData?.email,
                        city: userData?.city,
                        country: userData?.country,
                        moodlePhoto: userData?.moodlePhoto,
                        customPhoto: userData?.customPhoto,
                        active: userData?.active,
                        createdAt: userData?.createdAt.toDate(),
                        moodleToken: tokenBody?.moodleToken
                    }
                };
            }
        }

        return {
            'status': false,
            'message': 'INVALID_TOKEN'
        }
    }

    async deleteToken(token) {
        const tokenBody = jwtDecode(token);
        const username = tokenBody?.username;

        const activedToken = await tokenCollection.where('username', '==', username).get();

        for (let i = 0; i < activedToken.docs.length; i++) {
            const tokenId = activedToken.docs[i].id;
            await tokenCollection.doc(tokenId).delete();
        }
    }

}
const tokenManager = new TokenManager();
exports.tokenManager = tokenManager;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.removeHours = function (h) {
    this.setTime(this.getTime() - (h * 60 * 60 * 1000));
    return this;
}

function base64url(source) {
    var encodedSource = CryptoJS.enc.Base64.stringify(source);

    encodedSource = encodedSource.replace(/=+$/, '');

    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}