const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr');
const { arg } = require('mathjs');
module.exports = {
    name: 'rr-add',
    description: 'Ajoute un role au système de roles à réactions',
    aliases: ['addrolereaction'],

    cat: 'rr',
    args: true,
    usage: '@role',
    exemple: '@pub',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.channel.send(`${emojic.error} Veuillez indiquer un role valide !`)

        let emoji = args[1];
        if (!emoji) return message.channel.send(`${emojic.error} Veuillez fournir un emoji valide !`)
        if (message.guild.emojis.cache.get(args[0])) return message.channel.send(`${emojic.error} Je ne prend pas en charge les emojis personalisés , désolé  !`)

        let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
        if (channeldb) {

            return message.channel.send(`${emojic.error}  J'ai déja ce role dans ma base de donées...`);

        } else {
            const verynew = new rrmodel({
                serverID: `${message.guild.id}`,
                roleID: `${role.id}`,
                reaction: `${emoji}`,
            }).save();
            return message.channel.send(`${emojic.succes} Role à réaction ajouté avec succès : \`${role.name}\` ==> ${emoji}`);

        }











    },
};