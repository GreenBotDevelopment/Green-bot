const backup = require("discord-backup");
const emoji = require('../../emojis.json')
const Discord = require('discord.js')
const Backup = require('../../database/models/backup');

module.exports = {
    name: 'backup-load',
    description: 'Charge une backup du seveur',
    botpermissons: ['ADMINISTRATOR'],
    arg: true,
    usage: '<backup ID>',
    exemple: '805466867878723611',
    aliases: ['b-load'],
    cooldown: 300,
    cat: 'moderation',
    async execute(message, args) {
        if (message.author.id !== message.guild.owner.user.id) {
            return message.errorMessage(`Seulement l'owner du serveur peut charger une sauvegarde sur le serveur.`)
        }
        let backupID = args[0];
        if (!backupID) {
            return message.errorMessage(`Vous devez fournir l'ID de la sauvegarde à charger.`)
        }
        const check = await Backup.findOne({ RealID: args[0] })
        if (check) {
            if (check.autorID !== message.author.id) {
                return message.errorMessage(`Cette sauvegarde ne vous appartient pas , vous ne pouvez donc pas la charger.`)

            }
        } else {
            return message.errorMessage(`Je n'ai trouvé aucunne sauvegarde correspondante à cet ID`)

        }
        let BackupMessageID = check.MessageID;
        backup.fetch(BackupMessageID).then(async() => {
            let des = await message.translate(`Vous êtes sur le point de charger une backup .Assurez vous que cette backup est celle que vous voulez charger.
⚠ Tous les salons , rôles .. du serveur seront remplacés
Veuillez confirmer avec ✅ ou annuler avec ❌.`)
            const embed = new Discord.MessageEmbed()

            .setTitle('Charger la backup')
                .setDescription(des)


            .setFooter(message.client.footer)

            .setColor(message.client.color);

            message.channel.send(embed).then(m => {
                m.react("✅")
                m.react("❌")


                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                    const errorEmbed = new Discord.MessageEmbed()



                    .setDescription(`Erreur : temps écoulé ! `)


                    .setFooter(message.client.footer)

                    .setColor("#982318");
                    m.edit(errorEmbed);
                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.name === "✅") {
                        backup.load(BackupMessageID, message.guild).then(() => {

                            backup.remove(BackupMessageID);
                        }).catch((err) => {
                            return message.errorMessage(` Une erreur est survenue , vérifiez mes permissions .Veuillez rejoindre le support pour signaler cette erreur :
                            https://discord.gg/nrReAmApVJ`)

                        });


                    }
                    if (reaccion.emoji.name === "❌") {
                        return message.succesMessage(`Chargement de la backup annulée.`)
                    }
                });
            });


        }).catch((err) => {

            return message.errorMessage(`- Une erreur est survenue lors de l'éxécution de la commande . Veuillez rejoindre le support pour signaler cette erreur :
            https://discord.gg/nrReAmApVJ`);
        });


    },
};