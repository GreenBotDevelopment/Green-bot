module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    cat: 'owner',
    owner: true,
    usage: 'file name',
    execute(message, args) {
        const commandName = args[1].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            return message.reply("`❌` No commands found for " + commandName + ". Please try again.");
        }
        delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)];
        try {
            const newCommand = require(`../${args[0]}/${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.reply("`✅` The command " + newCommand.name + " has been succesfully reloaded on the current shard ");
        } catch (error) {
            console.error(error);
            message.reply("`❌` Something whent wrong while reloading the command:\n\`" + error.message + "\`");
        }
    },
};