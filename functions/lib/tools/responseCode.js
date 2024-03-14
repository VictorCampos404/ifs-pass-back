"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCode = void 0;
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["Success"] = 200] = "Success";
    ResponseCode[ResponseCode["Created"] = 201] = "Created";
    ResponseCode[ResponseCode["NoContent"] = 204] = "NoContent";
    ResponseCode[ResponseCode["BadRequest"] = 400] = "BadRequest";
    ResponseCode[ResponseCode["Unauthorized"] = 401] = "Unauthorized";
    ResponseCode[ResponseCode["Forbidden"] = 403] = "Forbidden";
    ResponseCode[ResponseCode["NotFound"] = 404] = "NotFound";
    ResponseCode[ResponseCode["NotAcceptable"] = 406] = "NotAcceptable";
    ResponseCode[ResponseCode["InternalServerError"] = 500] = "InternalServerError";
    ResponseCode[ResponseCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
})(ResponseCode = exports.ResponseCode || (exports.ResponseCode = {}));
//# sourceMappingURL=responseCode.js.map