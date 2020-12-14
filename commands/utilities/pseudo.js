const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'setpseudo',
    description: 'change votre pseudo',
    args: true,
    usage: '<pseudo>',
    exemple: 'pauldb09',
    cat: 'utilities',
    guildOnly: true,
    permissions: ['CHANGE_NICKNAME'],

    async execute(message, args) {



        const nickname = message.content.slice(message.content.indexOf(args[0]), message.content.length);

        if (nickname.length > 32) {
            return message.channel.send(`${emoji.error} Votre pseudo ne doit pas dépasser 32 caractères.`);
        } else if (message.member === message.guild.owner) {
            return message.channel.send(`${emoji.error} Je ne peux pas changer le pseudo du propriétaire du serveur.`);
        } else {
            try {



                await message.member.setNickname(nickname);
                return message.channel.send(`${emoji.succes} J'ai modifié votre pseudo en \`${nickname}\``);


            } catch (err) {
                return message.channel.send(`${emoji.error} Je ne suis pas assez haut pour changer votre pseudo !`);

            }
        }
    },
};