module.exports = {
    name: 'vote',
    description: 'Shows if you voted the bot in the last 12h',
    cat: 'utilities',
    aliases: ["hasvoted"],
    async execute(message, args, client, guildDB) {
        if (!client.config.links.topgg_url) return message.erroMessage("This command is currently disabled beacause i am not on top.gg yet :)")
        const voted = await client.dbl.hasVoted(message.member.id);
        message.channel.send({
            embeds: [{
                author: {
                    name: message.member.user.username,
                    icon_url: message.member.user.displayAvatarURL({ dynamic: true, size: 512 }),
                    url: client.config.links.invite
                },
                description: `${voted ? "You have already voted for me in the last 12h" :"You haven't for me in the last 12h"}\nYou can vote me by [Clicking here](${client.config.links.topgg_url}/vote).`,
                color: "#3A871F",
                footer: {
                    text: `${message.client.footer}`,
                    icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
                }
            }]
        })
    },
};