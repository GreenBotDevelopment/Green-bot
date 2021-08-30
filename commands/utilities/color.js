const fetch = require('node-fetch');
const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
var hexColorRegex = require('hex-color-regex');
module.exports = {
    name: 'color',
    description: 'Give informations about a color',
    cat: 'utilities',
    args: true,
    aliases: ['hex'],
    guildOnly: true,
    usage: '<color>',
    exemple: '#fff',
    async execute(message, args) {
        function hexColorCheck(a) {
            var check = hexColorRegex().test(a);
            var checkVerify = false;
            if (check == true) {
                checkVerify = true;
            }
            return checkVerify;
        }
        let color = args[0];
        var checkColor = hexColorCheck(color);
        if (checkColor == true) {
            let loadingTest = await message.translate("LOADING")
            let msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] })
            let final = color.replace("#", "")
            const res = await fetch(`https://api.alexflipnote.dev/color/${encodeURIComponent(final)}`).then(info => info.json())
            if (res.name === "Bad Request") {
                const lang = await message.translate("SET_COLOR")
                return message.errorMessage(lang.err).then(() => msg.delete());
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Color: ${res.hex}`)
                .addField("Name", `\`${res.name}\``, true)
                .addField("HEX", `\`${res.hex}\``, true)
                .addField("RBG", `\`${res.rgb}\``, true)
                .addField("Brightness", `\`${res.brightness}\``, true)
                .addField("INT", `\`${res.int}\``, true)
                .setThumbnail(res.image)
                .setImage(res.image_gradient)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(res.hex)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            const lang = await message.translate("SET_COLOR")
            return message.errorMessage(lang.err)
        }
    },
};