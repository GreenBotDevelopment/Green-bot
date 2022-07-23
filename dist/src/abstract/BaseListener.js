"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError {
    constructor(name) {
        this.name = name;
    }
    handler(err) {
        console.log(err);
        return console.log(`[${this.name || "Process<Unknownn>"}] ${err}`);
    }
}
exports.BaseError = BaseError;
