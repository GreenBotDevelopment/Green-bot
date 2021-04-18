const Discord = require('discord.js');
const { arg } = require('mathjs');
const guild = require('../../database/models/guild');
module.exports = {
    name: 'botautonick',
    description: 'Défini le suron donné automatiquement aux nouveaux bots',
    usage: '<surnom>',
    args: true,
    aliases: ['surnombotauto'],
    exemple: 'Bot - {username}',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],


    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `autonick_bot` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `autonick_bot` });


                return message.succesMessage(`Le surnom automatique pour les bots a bien été désactivé !`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        const nick = args.join(" ")
        if (!nick) return message.errorMessage(`Vous devez fournir un pseudo`)
        if (nick.length > 16 || nick.length < 3) return message.errorMessage('Votre surnom doit faire entre 3 et 16 caractères !');

        const autonicke = await guild.findOne({ serverID: message.guild.id, reason: `autonick_bot` });
        if (!autonicke) {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${nick}`,
                reason: 'autonick_bot',
            }).save();
            message.succesMessage(`L'autonick pour les bots a bien été défini pour ce serveur . Les nouveaux membres auront ce surnom .`);

        } else {
            const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `autonick_bot` }, { $set: { content: nick, reason: `autonick_bot` } }, { new: true });

            message.succesMessage(`J'ai bien mis à jour l'autonick pour les bots sur ce serveur.`);


        }









    },
};