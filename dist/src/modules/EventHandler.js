"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const fs_1 = require("fs");
class EventHandler {
    constructor(client) {
        this.client = client;
        this.build();
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = (0, fs_1.readdirSync)(`${this.client.location}/module/src/events`);
            for (const t of files) {
                if (t.endsWith(".map"))
                    return;
                const commandX = yield Promise.resolve().then(() => require(`${this.client.location}/module/src/events/${t}`));
                const c = commandX.default;
                const event = new c();
                event.once ? this.client.once(event.name, (...data) => event.run(...data, this.client)) : this.client.on(event.name, (...data) => event.run(...data, this.client)), 0;
            }
            return this;
        });
    }
}
exports.EventHandler = EventHandler;
