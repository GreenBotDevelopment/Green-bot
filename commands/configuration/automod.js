const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'automod',
    description: 'Active ou désactive le système d\'automodération',

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
                return message.channel.send(`${emoji.succes} - J'ai désactivé l'automodération dans ce serveur avec succès.`)

            } else {
                return message.channel.send(`${emoji.error} - Vous devez avoir une configuration pour la supprimer.`)
            }
        }
        if (args[0] === 'on') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `automod` })
            if (verify) {
                return message.channel.send(`${emoji.error} - L'automodération est déja activée dans ce serveur.`)

            } else {
                const verynew = new Welcome({
                    serverID: `${message.guild.id}`,
                    reason: 'automod',
                    channelID:'fdp',
                }).save();
                return message.channel.send(`${emoji.succes} - J'ai activé l'automodération dans ce serveur avec succès.`)
            }
        } else {
            return message.channel.send(`${emoji.error} Veuillez mettre un argument , on ou off !`)
        }
    },
};
