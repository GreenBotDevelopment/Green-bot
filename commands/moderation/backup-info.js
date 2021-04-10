const backup = require("discord-backup");
const emoji = require('../../emojis.json')
const Discord = require('discord.js')
const Backup = require('../../database/models/backup');
const ms = require("ms");

module.exports = {
    name: 'backup-info',
    description: 'Donne des infos sur une backup',

    arg: true,
    usage: '<backup ID>',

    exemple: '805466867878723611',
    aliases: ['b-info'],
  
    cat: 'moderation',
    async execute(message, args) {

        let backupID = args[0];
        if (!backupID) {
            return message.errorMessage(`Vous devez fournir l'ID de la sauvegarde sur laquelle vous voulez des infos.`)
        }
        const check = await Backup.findOne({ RealID: args[0] })
        if (check) {
            if (check.autorID !== message.author.id) {
                return message.errorMessage(`Cette sauvegarde ne vous appartient pas , vous ne pouvez donc pas voir des informations dessus.`)

            }
            const embed = new Discord.MessageEmbed()

            .setTitle(`Backup : \`${backupID}\``)
                .setDescription(`Cette backup appartient à \`${message.author.tag}\`.`)
                .addField("Taille", `${check.Size} mb`, true)
                .addField("ID de la sauvegarde", backupID, true)
                .addField("Salons", check.ChannelsCount, true)
                .addField("Rôles", check.RoleCount, true)

            .addField("Crée le", check.Date, true)

            .setFooter(message.client.footer)

            .setColor(message.client.color);

            message.channel.send(embed)
        } else {
            return message.errorMessage(`Je n'ai trouvé aucunne sauvegarde correspondante à cet ID`)

        }








    },
};