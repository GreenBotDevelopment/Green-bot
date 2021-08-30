const Discord = require('discord.js');
const moment = require('moment')
module.exports = {
    name: '8ball',
    description: 'Answer a question.',
    args: true,
    usage: "<question>",
    cat: 'games',
    async execute(message, args) {
        if (!args[0] || !message.content.endsWith("?")) {
            return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez poser une vraie question.":"Please ask a real question."}`);
        }
        const b = {

            "1": { "en": "I'm sure of it.", "fr": "Je suis sur de ça." },
            "2": { "en": "it's definitely safe.", "fr": "c'est définitivement sûr." },
            "3": { "en": "Yes, definitely.", "fr": "Bien sur que oui !" },
            "4": { "en": "Better not tell you now", "fr": "mieux vaut ne pas vous le dire maintenant." },
            "5": { "en": "Ask again later.", "fr": "ne comptez pas là-dessus." },
            "6": { "en": "Don't count on it.", "fr": "Je ne pense pas." },
            "7": { "en": "I don't think.", "fr": "Mes sources me disent que non." },
            "8": { "en": "My sources say no.", "fr": "Non." },
            "9": { "en": "No.", "fr": "Les pronostics ne sont pas très bons." },
            "10": { "en": "Outlook not so good.", "fr": "Mais oui c'est clair." },
        }
        const answerNO = parseInt(Math.floor(Math.random() * 10), 10);
        let x = answerNO + 1
        let num = `${x}`
        const answer = b[num][message.guild.settings.lang];
        return message.reply(`${answer}`);
    },
};