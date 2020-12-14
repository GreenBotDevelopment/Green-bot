const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'ban',
    description: 'Banni le membre fourni du serveur',
    aliases: ['banmember', 'bannir'],
    guildOnly: true,
    args: 'user',
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['BAN_MEMBERS'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    async execute(message, args, client) {


        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (user.id === message.author.id) {
            return message.channel.send(`${emoji.error} Vous ne pouvez pas bous bannir vous même !`)
        }

        // If the user is already banned
        const banned = await message.guild.fetchBans();
        if (banned.some((m) => m.user.id === user.id)) {
            return message.channel.send(`${emoji.error} ${user.user.tag} est déja dans la liste des bannisements de ce serveur !`)

        }

        // Gets the ban reason
        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = 'Aucunne raison donnée';
        }

        const member = await message.guild.members.fetch(user.id).catch(() => {});
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
                return message.channel.send(`${emoji.error} Cette personne est plus haute que vous dans la hiérachie !`)

            }
            if (!member.bannable) {
                return message.channel.send(`${emoji.error} Le bot n'est pas assez haut dans la hiérarchie pour bannir cet utilisateur !`)
            }
        }

        await user.send(`Bonjour ${user.user.tag}, Vous avez été banni de ${message.guild.name} pour la raison ${reason}.`).catch(() => {});

        // Ban the user
        message.guild.members.ban(user, { reason }).then(() => {

            // Send a success message in the current channel
            return message.channel.send(`${emoji.succes} J'ai bien banni ${user.user.tag} du serveur .`);





        }).catch((err) => {
            console.log(err);
            return message.channel.send(`${emoji.error} Le bot n'a pas la permission de bannir des membres !`)
        });




    },
};