const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'deban',
    description: 'Déban le membre fourni du serveur',
    guildOnly: true,
    usage: '<id> [raison]',
    exemple: '783708073390112830',
    cat: 'moderation',
    aliases: ['unban'],
    permissions: ['BAN_MEMBERS'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    async execute(message, args, client) {
        if (!args[0]) {
            return message.errorMessage(`Veuillez me fournir l'ID de la personne à débannir`)
        }
        if (args[0] === message.author.id) {
            return message.errorMessage(`Aha . Vous , n'êtes pas banni puisque je vous parle !`)
        }
        let reason = args.slice("1").join(" ") || "Aucune raison fournie";
        const banList = await message.guild.fetchBan(`${args[0]}`)

        if (!banList) return message.errorMessage(`L'id est invalide ou alors cette personne n'est pas bannie`)

        message.guild.members.unban(args[0], reason).catch(() => {
            console.log(err);
            return message.errorMessage(`Une erreur s'est produite , peut être les permissions`)
        })
        message.succesMessage(`L'utlisateur **${banList.user.username}** a bien été débanni du serveur . Vous pouvez l'inviter à nouveau !`)




    },
};