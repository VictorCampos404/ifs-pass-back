"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validations = void 0;
class Validations {
    isParamEmpty(param) {
        return param === undefined || param === null || param === '';
    }

    haveParamsInQuery(params, query){
        const keys = Object.keys(query);

        if(keys.length > params.length){
            return {
                status: false,
                message: 'Unexpected query parameter'
            }
        }

        for(let i = 0; i < keys.length; i++){
            const key = keys[i];

            const isExpected = params.find((element) => element == key);

            if(isExpected === undefined){
                return {
                    status: false,
                    message: 'Unexpected query parameter'
                }
            }
        }

        for(let i = 0; i < params.length; i++){
            const param = params[i];

            const isFinded = keys.find((element) => element == param);

            if(isFinded === undefined){
                return {
                    status: false,
                    message: 'Missing \'' + param + '\' query parameter'
                }
            }
        }

        return {
            status: true,
            message: 'Query parameter ok'
        }
        
    }

    haveParamsInBody(params, body){
        const keys = Object.keys(body);

        if(keys.length > params.length){
            return {
                status: false,
                message: 'Unexpected body parameter'
            }
        }

        for(let i = 0; i < keys.length; i++){
            const key = keys[i];

            const isExpected = params.find((element) => element == key);

            if(isExpected === undefined){
                return {
                    status: false,
                    message: 'Unexpected body parameter'
                }
            }
        }

        for(let i = 0; i < params.length; i++){
            const param = params[i];

            const isFinded = keys.find((element) => element == param);

            if(isFinded === undefined){
                return {
                    status: false,
                    message: 'Missing \'' + param + '\' body parameter'
                }
            }
        }

        return {
            status: true,
            message: 'Body parameter ok'
        }
        
    }
}
const validations = new Validations();
exports.validations = validations;