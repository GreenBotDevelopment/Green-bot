const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'anti-invite',
    description: 'Active ou désactive le système contre les invitations',


    cat: 'configuration',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'off') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `automod` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `automod` });
                return message.succesMessage(`J'ai désactivé le système contre les invitations dans ce serveur avec succès.`)

            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer.`)

            }

        }
        if (args[0] === 'on') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `automod` })
            if (verify) {
                return message.errorMessage(`le système contre les invitations est déja activée dans ce serveur.`)

            } else {
                const verynew = new Welcome({
                    serverID: `${message.guild.id}`,
                    reason: 'automod',
                    channelID: 'fdp',
                }).save();
                return message.succesMessage(`J'ai activé le système contre les invitations dans ce serveur avec succès.`)

            }


        } else {
            return message.errorMessage(`Veuillez mettre un argument , on ou off !`)
        }












    },
};