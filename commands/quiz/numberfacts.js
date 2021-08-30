const Discord = require('discord.js');
const fetch = require("node-fetch")
module.exports = {
    name: 'numberfacts',
    description: 'Gives a ramdom fact about a number',
    args: true,
    usage: "<number>",
    cat: 'utilities',
    async execute(message, args) {
        let number = args[0]
        if (isNaN(number) || number < 1 || number > 1000 || number.includes('-') || number.includes('+') || number.includes(',') || number.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
        } else {
            number = parseInt(args[0])
        }
        const embed = new Discord.MessageEmbed()
        try {
            const body = await fetch(`http://numbersapi.com/${number}/trivia`).then(res => res.text())
            let txt = body;
            if (message.guild.settings.lang === "fr") {
                txt = await message.gg(body)
            }
            embed.setTitle(txt)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch (e) {
            return message.errorOccurred(e)
        }
    }

};