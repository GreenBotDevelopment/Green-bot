module.exports = {
    name: 'vote',
    description: 'Shows if you voted Green-bot in the last 12h',
    cat: 'utilities',
    aliases: ["hasvoted"],
    async execute(message, args, client, guildDB) {
        const voted = await client.dbl.hasVoted(message.member.id);
        message.channel.send({
            embeds: [{
                author: {
                    name: message.member.user.username,
                    icon_url: message.member.user.displayAvatarURL({ dynamic: true, size: 512 }),
                    url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456"
                },
                description: `${voted ? "You have already voted for me in the last 12h" :"You haven't for me in the last 12h"}\nYou can vote me by [Clicking here](https://top.gg/bot/783708073390112830).`,
                color: "#3A871F",
                footer: {
                    text: `${message.client.footer}`,
                    icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
                }
            }]
        })
    },
};