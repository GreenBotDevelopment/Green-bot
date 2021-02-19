const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const guild = require('../../database/models/guild');
const emoji = require('../../emojis.json')

const { oneLine } = require('common-tags');
module.exports = {
    name: 'setlang',
    description: 'Change la langue dans lequel le bot parle',
    cat: 'configuration',
    args: true,
    usage: 'fr/en',
    exemple: 'fr',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'fr' || args[0] === 'french' || args[0] === 'français') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verify) {

                if (verify.content === 'fr') {
                    message.errorMessage(`Ma langue sur ce serveur est déja le français`)
                    return;
                } else {
                    const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { content: 'fr', reason: `lang` } }, { new: true });
                    return message.succesMessage(`Ma langue a bien été définie sur le **français** sur ce serveur.`)

                }

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    reason: 'lang',
                    content: 'fr',
                }).save();
                return message.succesMessage(`Ma langue a bien été définie sur le **français** sur ce serveur.`)

            }

        }
        if (args[0] === 'de' || args[0] === 'deutsch' || args[0] === 'german' | args[0] === 'allemand') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verify) {

                if (verify.content === 'de') {
                    message.errorMessage(`Ma langue sur ce serveur est déja l'allemand`)
                    return;
                } else {
                    const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { content: 'de', reason: `lang` } }, { new: true });
                    return message.succesMessage(`Ma langue a bien été définie sur **l'allemand** sur ce serveur.`)

                }

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    reason: 'lang',
                    content: 'de',
                }).save();
                return message.succesMessage(`Ma langue a bien été définie sur **l'allemand** sur ce serveur.`)

            }
        }
        if (args[0] === 'it' || args[0] === 'italien' || args[0] === 'italian' | args[0] === 'italiano') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verify) {

                if (verify.content === 'it') {
                    message.errorMessage(`Ma langue sur ce serveur est déja l'italien`)
                    return;
                } else {
                    const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { content: 'it', reason: `lang` } }, { new: true });
                    return message.succesMessage(`Ma langue a bien été définie sur **l'italien** sur ce serveur.`)

                }

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    reason: 'lang',
                    content: 'it',
                }).save();
                return message.succesMessage(`Ma langue a bien été définie sur **l'italien** sur ce serveur.`)

            }
        }
        if (args[0] === 'es' || args[0] === 'spanish' || args[0] === 'epagnol' | args[0] === 'spagnolo') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verify) {

                if (verify.content === 'es') {
                    message.errorMessage(`Ma langue sur ce serveur est déja l'espagnol`)
                    return;
                } else {
                    const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { content: 'es', reason: `lang` } }, { new: true });
                    return message.succesMessage(`Ma langue a bien été définie sur **l'espagnol** sur ce serveur.`)

                }

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    reason: 'lang',
                    content: 'es',
                }).save();
                return message.succesMessage(`Ma langue a bien été définie sur **l'espagnol** sur ce serveur.`)

            }
        }
        if (args[0] === 'en' || args[0] === 'english' || args[0] === 'england' || args[0] === 'anglais') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verify) {

                if (verify.content === 'en') {
                    message.errorMessage(`Ma langue sur ce serveur est déja l'anglais`)
                    return;
                } else {
                    const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { content: 'en', reason: `lang` } }, { new: true });
                    return message.succesMessage(`Ma langue a bien été définie sur **l'allemand** sur ce serveur.`)

                }

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    reason: 'lang',
                    content: 'en',
                }).save();
                return message.succesMessage(`Ma langue a bien été définie sur **l'anglais** sur ce serveur.`)

            }

        } else {
            message.errorMessage(`Veuillez fournir une langue valide .\n**Liste des langues**\nFrançais (fr)\nAnglais (en)\nAllemand (de)\nItalien (it)\nEspagnol (es)`)

        }












    },
};
