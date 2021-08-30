const Discord = require('discord.js');
module.exports = {
    name: 'nuke',
    description: 'Supprime tous les messages d\'un salon',
    aliases: ['purge', 'clone'],
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],

    permissions: ['MANAGE_CHANNELS'],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)

        }
        const lang = await message.translate("NUKE")
        const position = channel.position;
        const topic = channel.topic;

        const filter = (m) => m.author.id === message.author.id;
        const collector = channel.createMessageCollector({ filter, time: 1000000 });

        message.mainMessageT(lang.wait);

        collector.on("collect", async(m) => {
            if (m.content.toLowerCase() === "yes") {
                const channel2 = await channel.clone();

                channel2.setPosition(position);
                channel2.setTopic(topic);
                channel2.mainMessage(lang.ok, message.guild.settings.color);
                client.wait(1000)
                channel.delete()

            } else {
                collector.stop();
                let okk = await message.translate("CANCELED")

                message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(`**${okk}**`)] })
            }
        });



    },
};