module.exports = (client, message, query, tracks) => {
        const channel = queue.metadata.channel;

        channel.send({
                    embeds: [{
                                color: client.color,
                                author: { name: `Voici les résultats pour ${query}` },
                                footer: { text: 'Veuillez fournir un nombre entre 1 et 5' },

                                description: `${tracks.slice(0, 5).map((t, i) => `**#${i + 1}** - [\`${t.title}\`](${t.url}) `).join('\n')}\n\n Tapez \`cancel\` Pour annuler`,
        }],
    });

};