const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const { token } = require('../config.js');
console.log('• Loading the commands to refresh');
// the current amount of commands to refresh
const commands = [];
let x=-1;
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
        commands.push({name:getted.name,description:getted.description,options:getted.arguments?getted.arguments:[]});
    }
}
// stuffs are loaded, now lets log how many commands we have
console.log(`• Loaded ${commands.length} slash commands to refresh`);
// as per d.js guide, create a rest client
const rest = new REST({ version: '9' }).setToken(token);
// start the load up process
(async () => {
    try {
        console.log(`• Refreshing client "946414667436269579" slash commands. Developer Mode? `);
            await rest.put(Routes.applicationCommands("783708073390112830"), { body: commands });
        console.log(`• Success! Refreshed client "946414667436269579" slash commands`);
    } catch (error) {
        console.error(error);
    }
})();