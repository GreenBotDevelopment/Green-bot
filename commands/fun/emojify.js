const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const numberMap = {
    '0': ':zero:',
    '1': ':one:',
    '2': ':two:',
    '3': ':three:',
    '4': ':four:',
    '5': ':five:',
    '6': ':six:',
    '7': ':seven:',
    '8': ':eight:',
    '9': ':nine:',
};
module.exports = {
    name: 'emojify',
    description: 'Échange chaque lettre du message fourni avec un emoji.',
    args: true,
    exemple: 'Green-bot best bot',
    usage: '<texte>',
    cat: 'fun',
    async execute(message, args) {
        if (!args[0]) return message.channel.send(`${emoji.error} - Veuillez fournir un message .`)
        let msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        msg = msg.split('').map(c => {
            if (c === ' ') return c;
            else if (/[0-9]/.test(c)) return numberMap[c];
            else return (/[a-zA-Z]/.test(c)) ? ':regional_indicator_' + c.toLowerCase() + ':' : '';
        }).join('');

        if (msg.length > 2048) {
            msg = msg.slice(0, msg.length - (msg.length - 2033));
            msg = msg.slice(0, msg.lastIndexOf(':')) + '**...**';
        }

       
        message.channel.send(msg);
    },
};
