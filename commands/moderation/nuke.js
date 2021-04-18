const Discord = require('discord.js');
module.exports = {
    name: 'nuke',
    description: 'Supprime tous les messages d\'un salon',
    aliases: ['purge', 'clone'],
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],

    permissions: ['MANAGE_CHANNELS'],
    execute(message, args) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) {
            return message.errorMessage(`Le salon fourni n'est pas un salon valide`);
        }

        const position = channel.position;
        const topic = channel.topic;

        const filter = (m) => m.author.id === message.author.id;
        const collector = channel.createMessageCollector(filter, {
            time: 15000,
        });

        message.mainMessage(`Voulez vous vraiment supprimer tous les messages de ce salon ? Répondez par **yes** ou **no**`);

        collector.on("collect", async(m) => {
            if (m.content.toLowerCase() === "yes") {
                const channel2 = await channel.clone();

                channel2.setPosition(position);
                channel2.setTopic(topic);
                channel.delete();
                channel2.mainMessage(`**Salon Effacé**\nTous les messages de ce salon on étés supprimés avec succès.`, '#3A871F');
            } else {
                collector.stop();
                return message.succesMessage(`Suppression de tous les messages annulée.`);
            }
        });



    },
};