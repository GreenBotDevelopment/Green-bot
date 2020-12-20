const Discord = require('discord.js');
const math = require('mathjs');
const levelModel = require('../../database/models/level');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'addlevel',
    description: 'Ajoute un niveau à un utilisateur donné',
    aliases: ['add-level', 'give-level'],

    cat: 'level',
    args: true,
    usage: '@membre <nombre>',
    exemple: '@𝖕𝖆𝖚𝖑𝖉𝖇09#9846 2',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        const member = message.mentions.users.last() || message.guild.users.cache.get(args[0]);
        if (!member) return message.channel.send(`${emoji.error} Veuillez fournir un membre valide .`)
        const togive = parseInt(args[1]);
        if (isNaN(togive) === true || !togive || togive <= 0) {
            return message.channel.send(`${emoji.error} Veuillez fournir un nombre valide , supérieur à 0.`)
        }
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        if (userdata) {
            let newxp = math.evaluate(`${userdata.level} + ${togive}`)
            const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: member.id }, { $set: { level: newxp, } }, { new: true });
            return message.channel.send(`${emoji.succes}  Vous avez ajouté \`${togive}\` niveau(x) à ${member.tag} avec succès .`);

        } else {
            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${member.id}`,
                xp: 0,
                level: togive,
                messagec: 0
            }).save();

            return message.channel.send(`${emoji.succes}  Vous avez ajouté \`${togive}\` niveau(x) à ${member.tag} avec succès .`);

        }











    },
};
