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
exports.CommandLoader = void 0;
const fs_1 = require("fs");
class CommandLoader {
    constructor(client) {
        this.client = client;
        this.commands = [];
        this.slash = [];
        this.build("commands");
        setTimeout(() => {
            this.build("interactions");
        }, 2000);
    }
    get list() {
        return this.commands;
    }
    build(type) {
        const files = (0, fs_1.readdirSync)(`${this.client.location}/module/src/${type}`, { withFileTypes: true });
        files.forEach(cat => {
            const dirFiles = (0, fs_1.readdirSync)(`${this.client.location}/module/src/${type}/${cat.name}`, { withFileTypes: true });
            dirFiles.forEach((cmd) => __awaiter(this, void 0, void 0, function* () {
                if (cmd.name.endsWith(".map"))
                    return;
                try {
                    const command = new ((yield Promise.resolve().then(() => require(`${this.client.location}/module/src/${type}/${cat.name}/${cmd.name}`))).default);
                    type === "commands" ? this.commands.push(command) : this.slash.push(command);
                }
                catch (error) {
                    console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`);
                }
            }));
        });
    }
    getCommand(name) {
        return this.commands.find(cmd => cmd.name === name) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
    }
    getSlash(name) {
        return this.slash.find(cmd => cmd.name === name);
    }
    addCommand(command, type) {
        return type === "commands" ? this.commands.push(command) : this.slash.push(command);
    }
    removeCommand(commandName) {
        const index = this.commands.findIndex(cmd => cmd.name === commandName);
        if (!index || index == -1)
            return new Error("[CommandHandler] Requested to remove command but the name was not found: " + commandName + "");
        this.commands.slice(index, 1);
        return true;
    }
}
exports.CommandLoader = CommandLoader;
