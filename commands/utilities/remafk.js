const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const guild = require('../../database/models/guild');
module.exports = {
    name: 'remafk',
    description: 'Désactive votre afk sur le bot',
    aliases: ['reafk'],
  
    cat: 'utilities',
    guildOnly: true,


    async execute(message, args) {

        let biodb = await guild.findOne({ serverID: message.member.id, reason: `afk` })
        if (biodb) {
            const newchannel = await guild.findOneAndDelete({ serverID: message.member.id, reason: `afk` });
            return message.channel.send(`${emoji.succes} Votre afk a été désactivé avec succès`);
        } else {
          
            return message.channel.send(`${emoji.error} Vous n'êtes pas déja Afk .`);
        }
    },
};
