const EventEmitter = require("events");
export class BaseEvent extends EventEmitter {
    once: boolean;
    name: string
    constructor(event) {
     super();
     this.name = event.name;
     this.once = event.once;
    }
    exec(...e) {
        this.run(...e).catch((e) => this.emit("error", e));
    }
}

