const EventEmitter = require("events");
class BaseEvent extends EventEmitter {
    constructor(e) {
        if ((super(), (this.client = e), this.constructor === BaseEvent)) throw new TypeError('Abstract class "BaseEvent" cannot be instantiated directly.');
        if (void 0 === this.name) throw new TypeError('Classes extending BaseEvent must have a getter "name"');
        if (void 0 === this.once) throw new TypeError('Classes extending BaseEvent must have a getter "once"');
        if (void 0 === this.run) throw new TypeError('Classes extending BaseEvent must implement an async function "run"');
    }
    exec(...e) {
        this.run(...e).catch((e) => this.emit("error", e));
    }
}
module.exports = BaseEvent;