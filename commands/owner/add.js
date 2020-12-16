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
        if (!message.client.guilds.get(args[0])) return message.channel.send(`${emoji.error} Veuillez indiquer un ID de serveur valide`)
        let des = args.slice(1).join("");
        if (!des) return message.channel.send(`${emoji.error} Veuillez fournir une description pour ce serveur`)
        const verynew = new partner({
            serverID: `${args[0]}`,
            description: `${des}`,
            argent: '10',
        }).save();

message.channel.send(`${emoji.succes} Ce serveur a été add avec succès`)






    },
};
