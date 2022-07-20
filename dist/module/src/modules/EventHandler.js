"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const fs_1 = require("fs");
class EventHandler {
    client;
    constructor(client) {
        this.client = client;
        this.build();
    }
    async build() {
        const files = (0, fs_1.readdirSync)(`${this.client.location}/module/src/events`);
        for (const t of files) {
            if (t.endsWith(".map"))
                return;
            const commandX = await Promise.resolve().then(() => __importStar(require(`${this.client.location}/module/src/events/${t}`)));
            const c = commandX.default;
            const event = new c();
            event.once ? this.client.once(event.name, (...data) => event.run(...data, this.client)) : this.client.on(event.name, (...data) => event.run(...data, this.client)), 0;
        }
        return this;
    }
}
exports.EventHandler = EventHandler;
