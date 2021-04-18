const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr')
module.exports = {
    name: 'rr-list',
    description: 'Renvoie la liste de tous les roles à réaction du serveur',
    aliases: ['listrolereaction'],

    cat: 'admin',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb.length == 0) return message.errorMessage(`Il n'y a encore aucuns rôles à réaction pour ce serveur.`)
        if (channeldb.length < 8) {
            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Liste des Rôles à réactions`)


            .setDescription(channeldb.map(rr => `<@&${rr.roleID}> :  ${rr.reaction}`).join("\n"))

            .setFooter(message.client.footer)

            .setColor(message.client.color);
            message.channel.send(reportEmbed);

        } else {
            let i0 = 0;
            let i1 = 8;
            let page = 1;
            let description = channeldb.map(rr => `<@&${rr.roleID}> :  ${rr.reaction}`).slice(0, 8).join("\n");


            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color)
                .setTitle(`Liste des Rôles à réactions ${page}/${Math.ceil(channeldb.length / 8)}`)
                .setDescription(description)


            const msg = await message.channel.send(embed);

            await msg.react("⬅");
            await msg.react("➡");

            const c = msg.createReactionCollector((_reaction, user) => user.id === message.author.id);

            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1

                    if (i0 < 0) return;
                    if (page < 1) return;

                    let description = channeldb.map(rr => `<@&${rr.roleID}> :  ${rr.reaction}`).slice(i0, i1).join("\n");

                    embed.setTitle(`Liste des Rôles à réactions ${page}/${Math.ceil(channeldb.length / 8)}`)
                        .setDescription(description);

                    msg.edit(embed);
                }

                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1

                    if (i1 > channeldb.length + 8) return;
                    if (i0 < 0) return;

                    let description = channeldb.map(rr => `<@&${rr.roleID}> :  ${rr.reaction}`).slice(i0, i1).join("\n");

                    embed.setTitle(`Liste des Rôles à réactions ${page}/${Math.ceil(channeldb.length / 8)}`)
                        .setDescription(description);

                    msg.edit(embed);
                }

                await reaction.users.remove(message.author.id);
            })
        }












    },
};