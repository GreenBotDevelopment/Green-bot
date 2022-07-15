const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import config from "./config"
import { readdirSync } from "fs";

const { token } = require('./config.js');
console.log('• Loading the commands to refresh');
// the current amount of commands to refresh
const commands = [];
let x=-1;
// peseudo load the commands to get the interaction data
const files = readdirSync(`${__dirname}/src/interactions`, { withFileTypes: true });
files.forEach(cat => {
    const dirFiles = readdirSync(`${__dirname}/src/interactions/${cat.name}`, { withFileTypes: true });
    dirFiles.forEach(async cmd => {
        if (cmd.name.endsWith(".map")) return;
        try {
            const command = new ((await import(`${__dirname}/src/interactions/${cat.name}/${cmd.name}`)).default)
           commands.push({
            name: command.name,
            description: command.description,
            options: command.arguments,
           })
           console.log(commands)
        } catch (error) {
            console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`)
        }
       
    })
})
// stuffs are loaded, now lets log how many commands we have
setTimeout(()=>{
    console.log(`• Loaded ${commands.length} slash commands to refresh`);
// as per d.js guide, create a rest client
const rest = new REST({ version: '9' }).setToken(config.token);
// start the load up process
(async () => {
    try {
        console.log(`• Refreshing client "946414667436269579" slash commands. Developer Mode? `);
            await rest.put(Routes.applicationCommands(config.botId), { body: commands });
        console.log(`• Success! Refreshed client "946414667436269579" slash commands`);
    } catch (error) {
        console.error(error);
    }
})();
})