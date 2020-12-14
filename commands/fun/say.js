const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'say',
    description: 'fait parler le bot',
    args: true,
    exemple: 'Bonjour je suis le bot !!!',
    usage: '<texte>',
    cat: 'fun',
    permissions: ['ADMINISTRATOR'],
    async execute(message, args) {

        const sayMessage = args.join(" ")
        message.delete().catch(O_o => {});
        message.channel.send(sayMessage);
    },
};