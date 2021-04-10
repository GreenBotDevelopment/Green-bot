const backup = require("discord-backup");
const emoji = require('../../emojis.json')
const Discord = require('discord.js')
const Backup = require('../../database/models/backup');
const ms = require("ms");

module.exports = {
    name: 'backup-delete',
    description: 'Supprime une backup',

    arg: true,
    usage: '<backup ID>',
    exemple: 'p5o50317lG',
    aliases: ['b-delete'],

    cat: 'moderation',
    async execute(message, args) {

        let backupID = args[0];
        if (!backupID) {
            return message.errorMessage(`Vous devez fournir l'ID de la sauvegarde à supprimer.`)
        }
        const check = await Backup.findOne({ RealID: args[0] })
        if (check) {
            if (check.autorID !== message.author.id) {
                return message.errorMessage(`Cette sauvegarde ne vous appartient pas , vous ne pouvez donc pas la supprimer.`)

            }
            const delebak = await Backup.findOneAndDelete({ RealID: args[0] })
            let BackupMessageID = check.MessageID;
            backup.fetch(BackupMessageID).then(async() => {
                backup.remove(BackupMessageID);

            });
            message.succesMessage(`${emoji.succes} - La sauvegarde a bien été supprimée de la base de données`)
        } else {
            return message.errorMessage(`Je n'ai trouvé aucunne sauvegarde correspondante à cet ID`)

        }








    },
};