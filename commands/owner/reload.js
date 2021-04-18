const emoji = require('../../emojis.json')
module.exports = {
    name: 'reload',
    description: 'Reload une commande',
    args: true,
    cat: 'owner',
    usage: '[command name]',
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) ||
            message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`${emoji.error} Il n'y a aucunne commande de nom ou aliases \`${commandName}\`, ${message.author}!`);
        }

        delete require.cache[require.resolve(`../${command.cat}/${command.name}.js`)];

        try {
            const newCommand = require(`../${command.cat}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(` ${emoji.succes} la commande \`${command.name}\` a bien été rechargée !`);
        } catch (error) {
            console.error(error);
            message.channel.send(`${emoji.error} Une erreur est survenue en rechargeant la commande \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};