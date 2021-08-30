const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const { hangman } = require("reconlx");
const ms = require('ms');
module.exports = {
        name: 'hangman',
        description: 'Crée un pendu',
        aliases: ['pendu'],
        args: true,
        disabled: true,
        usage: "#channel <word>",
        permissions: ["MANAGE_MESSAGES"],
        cooldown: 10,
        cat: 'games',
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
        async execute(message, args, client) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!channel || channel.type !== 'GUILD_TEXT' || channel.guild.id !== message.guild.id) {
                let errorChannel = await message.translate("ERROR_CHANNEL")
                return message.errorMessage(errorChannel)

            }
            if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
                let a = await message.translate("CHANNEL_PERMS")
                return message.errorMessage(a)
            }
            if (!args.slice(1).join(" ")) return message.errorMessage(`${message.guild.settings.lang === "fr" ? `Veuillez fournir le mot du pendu.`:`Please provide the word of the hangman.`}`)

        if (channel.id !== message.channel.id) message.succesMessage(`${message.guild.settings.lang === "fr" ? `Je démarre le pendu dans ${channel}.`:`I start the hangman in ${channel}.`}`)

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