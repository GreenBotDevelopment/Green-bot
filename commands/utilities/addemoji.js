const emojiss = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
let isUrl = require("is-url");
module.exports = {
        name: 'addemoji',
        description: 'Ajoute un emoji au serveur',
        aliases: ['adde'],
        usage: '<emoji/url> [name]',
        cat: 'utilities',
        args: true,
        guildOnly: true,
        botpermissions: ['MANAGE_EMOJIS'],
        permissions: ['MANAGE_EMOJIS'],
        async execute(message, args) {
            let type = "";
            let name = "";
            let emote = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
            if (emote) {
                emote = args[0];
                type = "emoji";
                name = args.join(" ").replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi, "").trim().split(" ")[0];
            } else {
                emote = `${args.find(arg => isUrl(arg))}`
                name = args.find(arg => arg != emote);
                type = "url";
            }
            let emoji = { name: "" };
            let Link;
            if (type == "emoji") {
                emoji = Discord.Util.parseEmoji(emote);
                Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
            } else {
                if (!name) return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir un nom pour cet emoji.":"Please provide a name for this emoji."}`);
                if (name.length > 32) {
                    let numberErr = await message.translate("NUMBER_ERROR")
                    return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "32"))
                }
                Link = message.attachments.first() ? message.attachments.first().url : emote
            }
            try {

                let e = await message.guild.emojis.create(`${Link}`, `${`${name || emoji.name}`}`)
                const loadingTest = await message.translate("EMOJI_SUCCES")
                return message.succesMessage(`${loadingTest.replace("{emoji}",e)}`)
            } catch (err) {
                if (message.client.log) console.log(err)
                return message.channel.send(`\`❌\` Some errors occured.\n**Reasons:**\n\`\`\`-This server has reached the emojis limit.\n-Emoji size is too big.\n-The bot doesn't have enought permissions. (Manage Emoji)\`\`\``)
            }
    },
};