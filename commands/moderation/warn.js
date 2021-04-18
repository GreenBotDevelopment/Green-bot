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



        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        }
        if (member.user.bot) {
            return message.errorMessage(`Vous ne pouvez pas avertir un bot !`)
        }

        if (member.id === message.author.id) {
            return message.errorMessage(`Vous ne pouvez pas bous bannir vous même !`)
        }

        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
            return message.errorMessage(`Vous ne pouvez pas avertir une personne plus haute que vous dans la hiérachie !`)
        }

        const reason = args.slice(1).join(" ");
        if (!reason) {
            return message.errorMessage(`Veuillez indiquer une raison , on ne bannit pas sans raison !`)
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
                    return message.errorMessage(`Je n'ai pas pu MP ${member.user.tag} mais le warn a bien été enregistré. `)
                });

                message.succesMessage(`J'ai bien avertit ${member.user.tag} en MP . Il a désormais ${warndb.length +1 || '1'} warn(s)`)
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
                    return message.errorMessage(`Je n'ai pas pus MP ${member.user.tag} mais le warn a bien été enregistré. `)
                });

                message.succesMessage(`J'ai bien averti ${member.user.tag} en MP . C'est son premier warn`)
            });


        }
    },
};