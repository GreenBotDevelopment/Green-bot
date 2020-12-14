const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'clear',
    description: 'supprime des messages du salon actuel',
    aliases: ['prune', 'purge'],
    usage: '<nom>',
    cat: 'utilities',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],

    execute(message, args) {


        const messageArray = message.content.split(" ");

        let deleteamount;
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send(`${emoji.error} Merci de mettre un chiffre ente 1 et 100`);
        }

        if (parseInt(args[0]) > 100) {
            return message.channel.send(`${emoji.error} Il faut que le nombre de messages à supprimer soit moins ou égale à 100 messages!`)
        } else {
            deleteamount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteamount + 1, true)
    },
};