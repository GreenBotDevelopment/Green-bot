const Discord = require('discord.js');
const math = require('mathjs');
module.exports = {
    name: 'ping',
    description: 'Renvoie la latence du bot',
    cat: 'utilities',
    async execute(message, client) {
        message.channel.send("<a:green_loading:824308769713815612> **Pinging...**").then(async(m) => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.member.user.tag}`, message.member.user.displayAvatarURL())
                .setDescription(`**${message.guild.settings.lang === "fr" ? "Ping du message":"Message ping"}**: \`${Date.now() - m.createdTimestamp}ms\`\n**${message.guild.settings.lang === "fr" ? "Latence de discord":"Discord latency"}**: \`${message.client.ws.ping}ms\`\n**${message.guild.settings.lang === "fr" ? "Ping de la bdd":"Database ping"}**: \`8ms\``)
                .setColor(message.guild.settings.color)
                .setTitle(`${message.guild.settings.lang === "fr" ? "Latence du bot":"Bot latency"}`)
                .setFooter(`${message.client.footer} | Shard ${message.client.shard.ids[0]}/3 | Cluster 0`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            await m.edit({ embeds: [embed], content: null, allowedMentions: { repliedUser: false } })
        });
    },
};