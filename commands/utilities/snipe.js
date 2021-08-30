const Discord = require('discord.js');
const guild = require('../../database/models/guild');
const snipeSchema = require("../../database/models/snipe");
module.exports = {
    name: 'snipe',
    description: 'Sends the last message deleted in the current channel',
    aliases: ['s'],
    permissions: ["MANAGE_GUILD"],
    cat: 'utilities',
    async execute(message, client) {
        const snipe = await snipeSchema.findOne({
            guildID: message.guild.id,
            channelID: message.channel.id
        });
        if (!snipe) {
            let a = await message.translate("NO_SNIPE")
            return message.errorMessage(a)
        } else {
            if (snipe.embeds.length) {
                snipe.embeds.forEach(embed => {
                    embed.footer = {};
                    embed.footer.text = "ID: " + snipe.id + " • " + "channel: #" + snipe.channel;
                    embed.timestamp = snipe.createdTimestamp;
                    embed.author = {};
                    embed.author.name = snipe.author.tag;
                    embed.author.iconURL = snipe.author.avatar;
                    embed.color = message.guild.settings.color;
                    message.reply({
                        embeds: [embed],
                        allowedMentions: { repliedUser: false }
                    });
                });
                return;
            };
            const embed = {
                footer: {
                    text: "ID: " + snipe.id + " • " + "channel: #" + snipe.channel
                },
                color: message.guild.settings.color,
                description: snipe.content ? snipe.content : "embed ",
                author: {
                    name: "Message of " + snipe.author.tag,
                    iconURL: snipe.author.avatar
                },
                timestamp: snipe.createdTimestamp,
                fields: []
            }
            if (snipe.attachments.length) {
                let arrayOfAttachments = snipe.attachments.map(file => `Name: [${file.name}](${file.url})`).join("\n");
                if (arrayOfAttachments.length > 900) attachments = attachments.substr(0, 897) + "...";
                embed.fields.push({
                    name: "Files",
                    value: arrayOfAttachments
                });
            };
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            });
        };
    },
};