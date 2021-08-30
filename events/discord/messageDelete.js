const config = require("../../config"),
    Welcome = require("../../database/models/Welcome"),
    snipeSchema = require("../../database/models/snipe"),
    Discord = require("discord.js");
module.exports = {
        async execute(e, a) {
            if (!e) return;
            if (!e.guild) return;
            if (!e.author) return;
            if (e.partial) await e.fetch();
            const t = await snipeSchema.findOne({ guildID: e.guild.id, channelID: e.channel.id });
            let n = [];
            e.attachments && e.attachments.forEach(e => { n.push({ name: e.name, url: e.url }) });
            t ? await t.updateOne({ guildID: e.guild.id, channel: e.channel.name, id: e.id, channelID: e.channel.id, content: e.content ? e.content : null, author: { tag: e.author.tag, avatar: e.author.displayAvatarURL({ dynamic: !0 }) }, embeds: e.embeds.length ? e.embeds : [], attachments: n, createdTimestamp: e.createdTimestamp }) : new snipeSchema({ guildID: e.guild.id, channel: e.channel.name, id: e.id, channelID: e.channel.id, content: e.content ? e.content : null, author: { tag: e.author.tag, avatar: e.author.displayAvatarURL({ dynamic: !0 }) }, embeds: e.embeds.length ? e.embeds : [], attachments: n, createdTimestamp: e.createdTimestamp }).save();
            let i = await Welcome.findOne({ serverID: e.guild.id, reason: "logs" });
            if (i) {
                let a = e.guild.channels.cache.get(i.channelID);
                if (!a) return;
                let t = await e.guild.translate("MESSAGE_DELETE");
                const n = new Discord.MessageEmbed;
                n.setColor("#DF8212")
                    .setDescription(t.replace("{author}", e.author).replace("{channel}", e.channel))
                    .setAuthor(`${e.author.tag}`, e.author.displayAvatarURL({ dynamic: !0 }))
                    .addField("Message", `${e.content?e.content.length > 1020 ? `${e.content.slice(0, 1020) + '...'}`:e.content:e.embeds[0] ? "Embed":"Attachment (image, video etc)"}`, !0).setFooter("ID: " + e.id).setTimestamp(), a.send({ embeds: [n] })
        }
    }
};