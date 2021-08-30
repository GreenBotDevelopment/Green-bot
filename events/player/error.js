module.exports = async(client, queue, error) => {
    switch (error) {
        case 'NotPlaying':
            queue.metadata.errorMessage(`There is no music being played on this server !`);
            break;
        case 'NotConnected':
            let err = await queue.metadata.translate("NOT_VOC")
            queue.metadata.errorMessage(err)
            break;
        case 'UnableToJoin':
            queue.metadata.errorMessage(`I am not able to join your voice channel, please check my permissions !`);
            break;
        case 'VideoUnavailable':
            queue.metadata.errorMessage(`**${args[0].title}** is not available in your country! Skipping...`);
            break;
        case 'MusicStarting':
            queue.metadata.errorMessage(`The music is starting... please wait and retry!`);
            break;
        default:
            const Discord = require("discord.js")

            let a = await queue.metadata.translate("ERROR")
            const embederr = new Discord.MessageEmbed()
                .setColor('#F0B02F')
                .setTitle(a.title)
                .setDescription(a.desc)
                .setFooter(queue.metadata.client.footer, queue.metadata.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            queue.metadata.channel.send({ embeds: [embederr] })
          console.log(error)

            return;
    };
};