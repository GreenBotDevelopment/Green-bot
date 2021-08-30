const Discord = require('discord.js')
module.exports = async(client, queue) => {
    if (!queue.metadata) return console.log("Not metadata")

    const channel = queue.metadata.channel;

    let loadingTest = await queue.metadata.translate("QUEUE_END")
    channel.send({ embeds: [new Discord.MessageEmbed().setColor("#F0B02F").setDescription(`**${loadingTest}**`)] })

};