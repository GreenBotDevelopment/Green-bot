const backup = require("discord-backup");
const emoji = require('../../emojis.json')
module.exports = {
    name: 'backup',
    description: 'crée/modifie une backup',
    args: true,
    usage: 'create/load/delete/info',
    aliases: ['bck', 'sauvegarde'],
    cooldown: 30000,
    cat: 'utilities',
    execute(message, args) {

        const client = message.client;
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(`${emoji.error} | Oops , il vous manque la permission ADMINISTRATEUR!`);
        }

        if (args[0] === 'create') {
            backup.create(message.guild, {
                jsonBeautify: true
            }).then((backupData) => {
                backupData.id
                message.author.send(`${emoji.succes} Votre sauvegarde a été crée avec succès ! pour la charger , faites : \`${client.prefix}backup-load ${backupData.id}\``);
                message.channel.send(`${emoji.succes} Votre sauvegarde a été crée avec succès ! vous avez recu l'ID en MP`);
            });
        }
        if (args[0] === 'load') {


            let backupID = args[1]
            backup.fetch(backupID).then(async() => {

                message.channel.send(ldb.Bimp);
                await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch((err) => {
                    return message.channel.send(`${emoji.error} Temps écoulé , chargement anulé !`);
                });
                message.author.send(`${emoji.succes} Vous avez fait débuter le chargement de la backup...`);
                backup.load(backupID, message.guild).then(() => {

                    backup.remove(backupID);
                }).catch((err) => {
                    return message.author.send(`${emoji.error} Je ne trouve aucunne backup avec cet ID...`);
                });
            }).catch((err) => {
                console.log(err);

                return message.channel.send(`${emoji.error} Je ne trouve aucunne backup avec cet ID...`);
            });
        }
        if (args[0] === 'info') {
            backup.create(message.guild, {
                jsonBeautify: true
            }).then((backupData) => {
                backupData.id
                message.author.send(`${emoji.succes} Votre sauvegarde a été crée avec succès ! pour la charger , faites : \`${client.prefix}backup-load ${backupData.id}\``);
                message.channel.send(`${emoji.succes} Votre sauvegarde a été crée avec succès ! vous avez recu l'ID en MP`);
            });
        }
    },
};