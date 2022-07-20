"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEvent = void 0;
const EventEmitter = require("events");
class BaseEvent extends EventEmitter {
    once;
    name;
    constructor(event) {
        super();
        this.name = event.name;
        this.once = event.once;
    }
    exec(...e) {
        this.run(...e).catch((e) => this.emit("error", e));
    }
}
exports.BaseEvent = BaseEvent;
