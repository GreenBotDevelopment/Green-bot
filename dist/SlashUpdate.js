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
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config_1 = require("./config");
const fs_1 = require("fs");
const { token } = require('./config.js');
console.log('• Loading the commands to refresh');
// the current amount of commands to refresh
const commands = [];
const x = -1;
// peseudo load the commands to get the interaction data
const files = (0, fs_1.readdirSync)(`${__dirname}/src/interactions`, { withFileTypes: true });
files.forEach(cat => {
    const dirFiles = (0, fs_1.readdirSync)(`${__dirname}/src/interactions/${cat.name}`, { withFileTypes: true });
    dirFiles.forEach((cmd) => __awaiter(void 0, void 0, void 0, function* () {
        if (cmd.name.endsWith(".map"))
            return;
        try {
            const command = new ((yield Promise.resolve().then(() => require(`${__dirname}/src/interactions/${cat.name}/${cmd.name}`))).default);
            commands.push({
                name: command.name,
                description: command.description,
                options: command.arguments,
            });
            console.log(commands);
        }
        catch (error) {
            console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`);
        }
    }));
});
// stuffs are loaded, now lets log how many commands we have
setTimeout(() => {
    console.log(`• Loaded ${commands.length} slash commands to refresh`);
    // as per d.js guide, create a rest client
    const rest = new REST({ version: '9' }).setToken(config_1.default.token);
    // start the load up process
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`• Refreshing client "946414667436269579" slash commands. Developer Mode? `);
            yield rest.put(Routes.applicationCommands(config_1.default.botId), { body: commands });
            console.log(`• Success! Refreshed client "946414667436269579" slash commands`);
        }
        catch (error) {
            console.error(error);
        }
    }))();
});
