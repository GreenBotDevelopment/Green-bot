const guild = require('../../database/models/guild');
module.exports = {
    name: 'mode-quiz',
    description: 'Modifie les questions qui seront posées lors des quiz.',
    aliases: ['quiz-mode', ],
    guildOnly: true,
    cat: 'games',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const ID = message.member.id
        const lang = await message.translate("QUIZ_MODE")
        const prompts = lang.prompts
        const response = await getResponses(message)
        if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
        if (response.status) {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
            if (!verify) {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    content: true,
                    reason: 'quiz',
                }).save();
            }
        } else {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `quiz` });
            }
        }
        return message.succesMessage(lang.saved);
        async function getResponses(message) {
            const responses = {}
            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessageT(prompts[i]);
                const filter = m => m.author.id === ID;
                const response = await message.channel.awaitMessages({ filter, max: 1, })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    if (content === 'base') {
                        responses.status = null;
                    } else if (content === 'custom') {
                        responses.status = true;
                    } else {
                        return message.errorMessage(lang.invalid)
                    }
                }
            }
            return responses;
        }
    },
};