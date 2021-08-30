const CustomsQuizs = require('../../database/models/CustomsQuizs');
module.exports = {
    name: 'create-quiz',
    description: 'Crée un quiz personnalisé pour le serveur.',
    aliases: ['quiz-create', 'c-quiz'],
    guildOnly: true,
    cat: 'games',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const ID = message.member.id
        const lang = await message.translate("QUIZ_CREATE")
        const prompts = lang.prompts
        const response = await getResponses(message)
        if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
        let addTemps = new CustomsQuizs({
            serverID: `${message.guild.id}`,
            question: `${response.question}`,
            reponse: `${response.reponse}`,
        }).save()
        message.succesMessage(lang.saved.replace("{prefix}", message.guild.settings.prefix));
        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}
            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessageT(prompts[i]);
                const filter = m => m.author.id === ID;
                const response = await message.channel.awaitMessages({ filter, max: 1, })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    if (content.length < 1 || content.length > 1000) {
                        let numberErr = await message.translate("MESSAGE_ERROR")
                        return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
                    }
                    responses.question = content;
                }
                if (i === 1) {
                    if (content.length < 1 || content.length > 1000) {
                        let numberErr = await message.translate("MESSAGE_ERROR")
                        return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
                    }
                    responses.reponse = content;
                }
            }
            return responses;
        }
    },
};