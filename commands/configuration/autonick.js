const Discord = require('discord.js');
const { arg } = require('mathjs');
const guild = require('../../database/models/guild');
module.exports = {
    name: 'autonick',
    description: 'Défini le suron donné automatiquement aux nouveaux membres',
    usage: '<surnom>',
    args: true,
    aliases: ['surnomauto'],
    exemple: 'User - {username}',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],


    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `autonick` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `autonick` });


                return message.succesMessage(`Le surnom automatique a bien été désactivé !`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        const nick = args.join(" ")
        if (!nick) return message.errorMessage(`Vous devez fournir un pseudo`)
        const autonicke = await guild.findOne({ serverID: message.guild.id, reason: `autonick` });
        if (!autonicke) {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${nick}`,
                reason: 'autonick',
            }).save();
            message.succesMessage(`L'autonick a bien été défini pour ce serveur . Les nouveaux membres auront ce surnom .`);

        } else {
            const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `autonick` }, { $set: { content: nick, reason: `autonick` } }, { new: true });

            message.succesMessage(`J'ai bien mis à jour l'autonick pour ce serveur.`);


        }









    },
};