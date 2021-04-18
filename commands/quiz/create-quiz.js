const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');

const quizs = require('../../quiz.json');
const CustomsQuizs = require('../../database/models/CustomsQuizs');

const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! Commencez par me donner la question de ce quiz !",
    "Super ! et maintenant , quelle sera la réponse ? Une seule réponse est acceptée mais les majuscules ne comptent pas",

]
module.exports = {
    name: 'create-quiz',
    description: 'Crée un quiz personnalisé pour le serveur.',
    aliases: ['quiz-create', 'c-quiz'],
    guildOnly: true,
    cat: 'quiz',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {

        const response = await getResponses(message)

        let addTemps = new CustomsQuizs({
            serverID: `${message.guild.id}`,
            question: `${response.question}`,
            reponse: `${response.reponse}`,


        }).save()

        message.succesMessage(`Quiz enregistré avec succès pour ce serveur ! Pour autoriser seulement les quizs personnalisés , faîtes \`${message.guild.prefix}mode-quiz\``);


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
                    if (content.length < 1 || content.length > 1000) {
                        return message.errorMessage(`Votre question doit faire entre 1 et 1000 caractères`)
                        break;
                    }
                    responses.question = content;
                }
                if (i === 1) {
                    if (content.length < 1 || content.length > 1000) return message.errorMessage(`Votre réponse doit faire entre 1 et 1000 caractères`)
                    responses.reponse = content;
                }


            }
            return responses;
        }
    },
};