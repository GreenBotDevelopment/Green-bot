"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(client) {
        this.client = client;
        if (this.constructor === Command)
            throw new TypeError('Abstract class "QuickCommand" cannot be instantiated directly.');
    }
}
exports.Command = Command;
