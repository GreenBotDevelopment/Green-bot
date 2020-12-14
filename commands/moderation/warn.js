const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'warn',
    description: 'Avertit en Messages privés la personne donnée',
    aliases: [],
    guildOnly: true,
    args: 'user',
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],


    async execute(message, args, client) {



        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (member.user.bot) {
            return message.channel.send(`${emoji.error} Vous ne pouvez pas avertir un bot !`)
        }

        if (member.id === message.author.id) {
            return message.channel.send(`${emoji.error} Vous ne pouvez pas bous bannir vous même !`)
        }

        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
            return message.channel.send(`${emoji.error} Vous ne pouvez pas avertir une personne plus haute que vous dans la hiérachie !`)
        }

        const reason = args.slice(1).join(" ");
        if (!reason) {
            return message.channel.send(`${emoji.error} Veuillez indiquer une raison  !`)
        }

        let warndb = await Warn.find({ serverID: message.guild.id, manID: member.id })
        if (warndb) {
            const verynew = new Warn({
                serverID: `${message.guild.id}`,
                manID: `${member.id}`,
                reason: `${reason}`,
                date: new Date,
                moderator: `${message.author.id}`
            }).save().then(async() => {
                member.send(`Bonjour ${member.user.tag}, Vous avez été avertit sur ${message.guild.name} pour la raison ${reason}.`).catch(() => {
                    return message.channel.send(`${emoji.error} Je n'ai pas pus MP ${member.user.tag} mais le warn a bien été enregistré. `)
                });

                message.channel.send(`${emoji.succes} J'ai bien avertit ${member.user.tag} en MP . Il a désormais ${warndb.length || '1'} warn(s)`)
            });


        } else {
            const verynew = new Warn({
                serverID: `${message.guild.id}`,
                manID: `${member.id}`,
                reason: `${reason}`,
                date: Date.now(),
                moderator: `${message.author.id}`
            }).save().then(() => {
                member.send(`Bonjour ${member.user.tag}, Vous avez été avertit sur ${message.guild.name} pour la raison ${reason}.`).catch(() => {
                    return message.channel.send(`${emoji.error} Je n'ai pas pus MP ${member.user.tag} mais le warn a bien été enregistré. `)
                });

                message.channel.send(`${emoji.succes} J'ai bien avertit ${member.user.tag} en MP . C'est son premier warn`)
            });


        }
    },
};