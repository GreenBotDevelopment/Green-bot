const { Util } = require('discord.js');
let isUrl = require("is-url");
module.exports = {
        name: 'addemoji',
        description: 'Ajoute un emoji au serveur',
        aliases: ['adde'],
        usage: '<emoji/url> [name]',
        cat: 'utilities',
        args: true,
        botpermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
        permissions: ['MANAGE_EMOJIS_AND_STICKERS'],
        async execute(message, args, client, guildDB) {
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
                emoji = Util.parseEmoji(emote);
                Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
            } else {
                if (!name) return message.errorMessage(`${guildDB.lang === "fr" ? "Veuillez fournir un nom pour cet emoji.":"Please provide a name for this emoji."}`);
                if (name.length > 32) {
                    let numberErr = await message.translate("NUMBER_ERROR", guildDB.lang)
                    return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "32"))
                }
                Link = message.attachments.first() ? message.attachments.first().url : emote
            }
            try {
                let e = await message.guild.emojis.create(`${Link}`, `${`${name || emoji.name}`}`)
                const loadingTest = await message.translate("EMOJI_SUCCES", guildDB.lang)
                return message.succesMessage(`${loadingTest.replace("{emoji}",e)}`)
            } catch (err) {
            return message.channel.send(`\`❌\` Some errors occured.\n**Reasons:**\n\`\`\`-This server has reached the emojis limit.\n-Emoji size is too big.\n-The bot doesn't have enought permissions. (Manage Emoji)\`\`\``)
            }
    },
};