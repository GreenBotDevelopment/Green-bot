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
exports.CommandLoader = void 0;
const fs_1 = require("fs");
class CommandLoader {
    client;
    commands;
    slash;
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
            dirFiles.forEach(async (cmd) => {
                if (cmd.name.endsWith(".map"))
                    return;
                try {
                    const command = new ((await Promise.resolve().then(() => __importStar(require(`${this.client.location}/module/src/${type}/${cat.name}/${cmd.name}`)))).default);
                    type === "commands" ? this.commands.push(command) : this.slash.push(command);
                }
                catch (error) {
                    console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`);
                }
            });
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
