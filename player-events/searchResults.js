module.exports = (client, message, query, tracks) => {

        message.channel.send({
                    embed: {
                        color: client.color,
                        author: { name: `Voici les résultats pour ${query}` },
                        footer: { text: client.footer },
                        timestamp: new Date(),
                        description: `${tracks.slice(0, 5).map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`,
        },
    });

};