const backup = require("discord-backup");
const emoji = require('../../emojis.json')
const Discord = require('discord.js')
const Backup = require('../../database/models/backup');
const ms = require("ms");

module.exports = {
        name: 'backup-list',
        description: 'Donne la liste de toutes vos sauvegardes',

        aliases: ['b-list'],

        cat: 'moderation',
        async execute(message, args) {


            const check = await Backup.find({ autorID: message.author.id })
            if (check.length > 0) {
                const embed = new Discord.MessageEmbed()

                .setTitle(`Liste de vos backups`)
                    .setFooter(message.client.footer)

                .setColor(message.client.color)

                .addField(`Backups (${check.length})`, `${check.map(b=> `\`${b.RealID}\` (32mb , ${b.Date})`).join('\n')}`)

            message.channel.send(embed)



        } else {
            return message.errorMessage(`Vous n'avez encore crée aucunne sauvegarde`)

        }



    },
};