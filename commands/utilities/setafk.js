const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const guild = require('../../database/models/guild');
module.exports = {
    name: 'setafk',
    description: 'Active votre afk sur le bot',
    aliases: ['afk'],
    args: true,
    exemple: 'mange',
    usage: '<raison>',
    cat: 'utilities',
    guildOnly: true,


    async execute(message, args) {

        let bio = args.join(" ")


        if (bio.includes('@everyone')) return message.channel.send(`${emoji.error} Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !`)
        if (bio.includes('@here')) return message.channel.send(`${emoji.error} Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !`)
        if (bio.length < 2 || bio > 10) {
            if (bio.includes('@here')) return message.channel.send(`${emoji.error} Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !`)
        }
        let biodb = await guild.findOne({ serverID: message.member.id, reason: `afk` })
        if (biodb) {
            const newchannel = await guild.findOneAndUpdate({ serverID: message.member.id, reason: `afk` }, { $set: { content: bio, reason: `afk` } }, { new: true });
            return message.channel.send(`${emoji.succes} Votre afk été mis à jour`);
        } else {
            const verynew = new guild({
                serverID: `${message.member.id}`,
                content: `${bio}`,
                reason: 'afk',
            }).save();
            return message.channel.send(`${emoji.succes} Votre afk a été enregistrée avec succès!`);
        }
    },
};
