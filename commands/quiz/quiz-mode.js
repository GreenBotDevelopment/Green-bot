const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const CustomsQuizs = require('../../database/models/CustomsQuizs');

const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! Voulez vous que les questions sur ce serveur soient les questions de base ou personnalisées ? répondez par **base** ou **custom**",

]
module.exports = {
    name: 'mode-quiz',
    description: 'Crée un quiz personnalisé pour le serveur.',
    aliases: ['quiz-mode', 'c-quiz'],
    guildOnly: true,
    cat: 'quiz',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {

        const response = await getResponses(message)

        if (response.status) {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
            if (verify) {

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    content: true,
                    reason: 'quiz',
                }).save();

            }
        }
        if (!response.status) {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `quiz` });



            } else {}
        }
        message.succesMessage(`Configuration sauvegardée avec succès !`);


        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}

            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessage(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    if (content === 'base') {
                        responses.status = null;
                    } else if (content === 'custom') {
                        responses.status = true;

                    } else {
                        return message.errorMessage(`Veuillez fournir l'argument attendu : **base** ou **custom**`)
                    }
                }



            }
            return responses;
        }
    },
};