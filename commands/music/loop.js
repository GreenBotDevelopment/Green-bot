const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'loop',
    description: 'Active /désactive la répetition',
    cat: 'musique',
    exemple: 'queue',
    args: true,
    usage: 'queue/song',
    aliases: ['lp', 'repeat'],

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.errorMessage(`Nous ne sommes pas dans le même salon vocal`);

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)



        const queue = message.client.player.getQueue(message);
        if (args.join(" ").toLowerCase() === 'queue') {
            if (queue.loopMode) {
                message.client.player.setLoopMode(message, false);
                return message.mainMessage(`🔁 Répétition de la queue **désactivée**`);
            } else {
                message.client.player.setLoopMode(message, true);
                return message.mainMessage(`🔁 Répétition de la queue **activée**`);
            };
        } else if (args.join(" ").toLowerCase() === 'song') {
            if (queue.repeatMode) {
                message.client.player.setRepeatMode(message, false);
                return message.mainMessage(`🔂 Répétition de la musique **activée**`);
            } else {
                message.client.player.setRepeatMode(message, true);
                return message.mainMessage(`🔂 Répétition de la musique **activée**`);
            };
        } else {
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setDescription(`Il vous faut des arguments pout la commande \`loop\` ! \nUsage correct : \`${message.guild.prefix}loop queue/song\``)

            .setFooter(message.client.footer)
                .setColor("#982318")

            message.channel.send(reportEmbed);
        }













    },
};