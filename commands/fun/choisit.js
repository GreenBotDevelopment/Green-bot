const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'choisit',
    description: 'faut choisir le bot entre deux options',
    args: true,
    exemple: 'banane tacos',
    usage: '<1erchoix> <2eme choix>',
    cat: 'fun',
    async execute(message, args) {
        const choice1 = args[0]
        const choice2 = args.slice(1).join(" ")
        if (!choice2) return message.channel.send(`${emoji.error} Veuillez indiquer un deuxième choix !`);

        var choices = [`${choice1}`, `${choice2}`]
        message.channel.send(`${choices[Math.floor(Math.random() * choices.length)]} !`);
    },
};