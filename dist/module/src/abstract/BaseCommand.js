"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
class Argument {
    name;
    required;
    description;
}
class CommandCheck {
    vote;
    premium;
    voice;
    channel;
    dispatcher;
}
class BaseCommand {
    name;
    permissions;
    description;
    checks;
    aliases;
    arguments;
    run;
    constructor(commandData) {
    }
}
exports.BaseCommand = BaseCommand;
