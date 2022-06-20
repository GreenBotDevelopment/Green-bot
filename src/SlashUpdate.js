const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// Script from https://github.com/Deivu/Kongou/blob/master/src/SlashUpdate.js

const { readdirSync } = require('fs');
const { token, slashCommands } = require('../config.js');
const load = async function() {
    if (!slashCommands.clientId) return console.log("Not loead")
    console.log('• Loading the commands to refresh');
    // the current amount of commands to refresh
    const commands = [];
    let x = -1;
    // peseudo load the commands to get the interaction data
    for (const directory of readdirSync(`${__dirname}/interactions`, { withFileTypes: true })) {
        if (!directory.isDirectory()) continue;
        for (const command of readdirSync(`${__dirname}/interactions/${directory.name}`, { withFileTypes: true })) {
            if (!command.isFile()) continue;
            const Interaction = require(`${__dirname}/interactions/${directory.name}/${command.name}`)
            const getted = new Interaction({})
            x++
            console.log(`Command ${x} is ${getted.name}`)
            console.log(getted.arguments)
            commands.push({ name: getted.name, description: getted.description, options: getted.arguments ? getted.arguments : [] });
        }
    }
    // stuffs are loaded, now lets log how many commands we have
    console.log(`• Loaded ${commands.length} slash commands to refresh`);
    // as per d.js guide, create a rest client
    const rest = new REST({ version: '9' }).setToken(token);
    // start the load up process
    (async() => {
        try {
            console.log(`• Refreshing client "${slashCommands.clientId}" slash commands. Developer Mode? `);
            await rest.put(Routes.applicationCommands(slashCommands.clientId), { body: commands });
            console.log(`• Success! Refreshed client "${slashCommands.clientId}" slash commands`);
        } catch (error) {
            console.error(error);
        }
    })();
}
load()
module.exports ={load()}
