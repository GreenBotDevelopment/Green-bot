const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const { hangman } = require("reconlx");
const ms = require('ms');
module.exports = {
    name: 'pendu',
    description: 'Crée un pendu',
    aliases: ['hangman'],
    cooldown: 10,
    cat: 'quiz',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.errorMessage(`Veuillez fournir le salon dans lequel va se faire le pendu`);
        }
        if (!args.slice(1).join(" ")) return message.errorMessage(`Vous devez fournir le mot du pendu !`)

        if (channel.id !== message.channel.id) message.succesMessage(`Je démarre le pendu dans ${channel}`)

        // making hangman
        const hang = new hangman({
            message: message,
            word: args.slice(1).join(" "),
            client: message.client,
            channelID: channel.id,
        });

        // starting the game
        hang.start();

    },
};