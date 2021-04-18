const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const premiumDB = require('../../database/models/premium');

const partner = require("../../database/models/partner");
module.exports = {
    name: 'givep',
    owner: true,
    description: 'Affiche tous les serveurs partenaires que vous pouvez rejoindre pour gagner des crédits',
    args: true,
    usage: '<use>',
    aliases: ['addballet'],
    cat: 'rpg',
    async execute(message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        }
        const premium = await premiumDB.findOne({ userID: member.id })
        if (!premium) {
            let newd = new premiumDB({
                userID: member.id,
                count: 1,
            }).save()
        }
        message.succesMessage(`NICECECCCECECECCCECE`)




    },
};