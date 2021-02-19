const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");

module.exports = {
        name: 'addemoji',
        description: 'Ajoute un emoji au serveur',
        aliases: ['adde'],
        usage: '<nom> <url>',
        cat: 'utilities',
        guildOnly: true,
        permissions: ['MANAGE_MESSAGES'],

        async execute(message, args) {

            const emoji = args[0];
            if (!emoji) return message.errorMessage(`Veuillez me donnez un emoji à ajouter`);

            let customemoji = Discord.Util.parseEmoji(emoji);
            if (customemoji.id) {
                const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${customemoji.animated ? "gif" : "png"
                }`;
                const name = args.slice(1).join(" ");
                try {

                    await message.guild.emojis.create(
                            `${Link}`,
                            `${name || `${customemoji.name}`}`
                ).then(emoji =>{
                    return message.sendT(`Emoji ajouté avec succès au serveur **${emoji}**`)

                })
            } catch (err) {
                return message.errorMessage(`An error has occured!\n\n**Possible Reasons:**\n\`\`\`- This server has reached the emojis limit\n- The bot doesn't have permissions.\n- The emojis size is too big.\`\`\``)
           
            }
        } else {
            let CheckEmoji = parse(emoji, { assetType: "png" });
            if (!CheckEmoji[0]) return message.errorMessage(`Veuillez me donnez un emoji à ajouter`);
            message.errorMessage(
                `You Can Use Normal Emoji Without Adding In Server!`
            );
        }
    },
};
