const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')

const partner = require("../../database/models/partner");
module.exports = {
    name: 'addbal',
    owner: true,
    description: 'Affiche tous les serveurs partenaires que vous pouvez rejoindre pour gagner des crédits',
    args: true,
    usage: '<serverID> <description>',
    aliases: ['addballet'],
    cat: 'rpg',
    async execute(message, args) {
     
        let des = args.join(" ");
        if (!des) return message.channel.send(`${emoji.error} Veuillez fournir une description pour ce serveur`)
        let invite = await message.channel.createInvite({
  maxAge: 0, // 0 = infinite expiration
  maxUses: 0 // 0 = infinite uses
}).catch(console.error);
        const verynew = new partner({
            serverID: `${message.guild.id}`,
            description: `${des}`,
            argent: '10',
            reason: `${invite.code}`,
        }).save();

message.channel.send(`${emoji.succes} Ce serveur a été add avec succès`)






    },
};
