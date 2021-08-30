const Discord = require('discord.js');
const rrmodel = require('../../database/models/rr');
const { parse } = require("twemoji-parser");
const prompts = [
    "Bonjour ! Commencez par me donner le rôle qui devra être donné!",
    "Super ! et maintenant donnez l'emoji qui devra déclencher l'ajout de rôle . Seulement les emojis de base sont supportés .",

]
module.exports = {
        name: 'rolereact',
        description: 'Gère les rôles react du serveur',
        cat: 'configuration',
        args: true,
        usage: 'add/list/remove/send/removeall @role',
        exemple: 'add @test',
        aliases: ["reactrole"],
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const ID = message.member.id;
            const lang = await message.translate("ROLEREACT")
            let type = args[0];
            if (!type || (type !== "add" && type !== "list" && type !== "send" && type !== "remove" && type !== "removeall")) {
                let err = await message.translate("ARGS_REQUIRED")
                const reportEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(`${err.replace("{command}","rolereact")} \`${message.guild.settings.prefix}rolereact add/list/remove/send/removeall @role\``)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL())
                    .setColor("#F0B02F")
                return message.channel.send({ embeds: [reportEmbed] })
            }
            if (type === 'add') {
                const response = await getResponses(message)
                message.succesMessage(lang.AddOK.replace("{role}", response.role.name).replace("{emoji}", response.emoji).replace("{prefix}", message.guild.settings.prefix));
                const verynew = new rrmodel({
                    serverID: `${message.guild.id}`,
                    roleID: `${response.role.id}`,
                    reaction: `${response.emoji}`,
                }).save();
                async function getResponses(message) {
                    const responses = {}
                    for (let i = 0; i < prompts.length; i++) {
                        let goodText = await message.gg(prompts[i])
                        await message.mainMessageT(goodText);
                        const filter = m => m.author.id === ID;
                        const response = await message.channel.awaitMessages({ filter, max: 1, })
                        const { content } = response.first();
                        const m = response.first();
                        if (i === 0) {
                            let role = m.mentions.roles.first() || message.guild.roles.cache.get(content);
                            if (!role || role.name === '@everyone' || role.managed) {
                                let err = await message.translate("ERROR_ROLE")
                                return message.errorMessage(err);
                                break;

                            } else {
                                let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
                                if (channeldb) {
                                    return message.errorMessage(lang.addAlready)
                                    break;
                                }
                                if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                                    return message.errorMessage(lang.position);
                                    break;
                                }
                                responses.role = role;
                            }
                        }
                        if (i === 1) {
                            let customemoji = Discord.Util.parseEmoji(content);
                            if (customemoji.id) {
                                return message.errorMessage(lang.addCustom);
                                break;
                            } else {
                                let CheckEmoji = parse(content, { assetType: "png" });
                                if (!CheckEmoji[0]) {
                                    return message.errorMessage(lang.emojiErr)
                                    break;
                                }
                                responses.emoji = content;
                            }
                        }
                    }
                    return responses;
                }
            } else if (type === 'remove') {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
                if (!role) {
                    let err = await message.translate("ERROR_ROLE")
                    return message.errorMessage(err);
                }
                let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
                if (channeldb) {
                    const newchannel = await rrmodel.findOneAndDelete({ serverID: message.guild.id, roleID: role.id });
                    return message.succesMessage(lang.deleteOK);
                } else {
                    return message.errorMessage(lang.deleteErr);
                }
            } else if (type === 'send') {
                let channeldb = await rrmodel.find({ serverID: message.guild.id })
                if (channeldb) {
                    if (channeldb.length == 0) {
                        return message.errorMessage(lang.noRole.replace("{prefix}", message.guild.settings.prefix));
                    }
                    if (!args.slice(1).join(" ")) return message.errorMessage(lang.noDesc.replace("{prefix}", message.guild.settings.prefix))
                    if (args.slice(1).join(" ").length < 3 || args.slice(1).join(" ").length > 100) {
                        let numberErr = await message.translate("MESSAGE_ERROR")
                        return message.errorMessage(numberErr.replace("{amount}", "3").replace("{range}", "200"))
                    }
                    message.channel.send(`**${args.slice(1).join(" ")}**\n${channeldb.map(rr => ` ${rr.reaction} <@&${rr.roleID}> `).join(`\n\n`)}`).then(function(message) {
                channeldb.forEach(command => {
                    message.react(command.reaction);
                });
            })
        } else {
            return message.errorMessage(lang.noRole.replace("{prefix}", message.guild.settings.prefix));
        }
        }  else if (type === 'list') {
            let channeldb = await rrmodel.find({ serverID: message.guild.id })
            if (channeldb.length == 0)   return message.errorMessage(lang.noRole.replace("{prefix}", message.guild.settings.prefix));
            if (channeldb.length < 8) {
                const reportEmbed = new Discord.MessageEmbed()
                 .setTitle(`Reactions roles`)
                 .setDescription(`${lang.desc.replace("{prefix}",message.guild.settings.prefix)}\n\n${channeldb.map(rr => `${message.guild.roles.cache.get(rr.roleID) ? `${message.guild.roles.cache.get(rr.roleID)}` : lang.nonon} ➡  ${rr.reaction}`).join("\n")}`)
                 .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                 .setColor(message.guild.settings.color);
           message.channel.send({embeds:[reportEmbed]})
        } else {
            let i0 = 0;
            let i1 = 8;
            let page = 1;
            let description = channeldb.map(rr => `${lang.desc.replace("{prefix}",message.guild.settings.prefix)}\n\n${message.guild.roles.cache.get(rr.roleID) ? `${message.guild.roles.cache.get(rr.roleID)}` : lang.nonon} ➡  ${rr.reaction}`).slice(0, 8).join("\n");


            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.settings.color)
                .setTitle(`Reactions roles ${page}/${Math.ceil(channeldb.length / 8)}`)
                .setDescription(description)


            const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

            await msg.react("⬅");
            await msg.react("➡");

  const filter = (reaction, user) => user.id === message.author.id;
            const c = msg.createReactionCollector({ filter, time: 1000000 });

            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1

                    if (i0 < 0) return;
                    if (page < 1) return;

                    let description = channeldb.map(rr => `${lang.desc.replace("{prefix}",message.guild.settings.prefix)}\n\n${message.guild.roles.cache.get(rr.roleID) ? `${message.guild.roles.cache.get(rr.roleID)}` : lang.nonon} ➡  ${rr.reaction}`).slice(i0, i1).join("\n");

                    embed.setTitle(`Reactions roles ${page}/${Math.ceil(channeldb.length / 8)}`)
                        .setDescription(description);

                   msg.edit({embeds:[embed]});
                }

                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1

                    if (i1 > channeldb.length + 8) return;
                    if (i0 < 0) return;

                    let description = channeldb.map(rr => `${lang.desc.replace("{prefix}",message.guild.settings.prefix)}\n\n${message.guild.roles.cache.get(rr.roleID) ? `${message.guild.roles.cache.get(rr.roleID)}` : lang.nonon} ➡  ${rr.reaction}`).slice(i0, i1).join("\n");

                    embed.setTitle(`Reactions roles ${page}/${Math.ceil(channeldb.length / 8)}`)
                        .setDescription(description);

 msg.edit({embeds:[embed]})               
 }

                await reaction.users.remove(message.author.id);
            })
        }
    } else if (type === 'removeall') {
        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {
            if (channeldb.length == 0)   return message.errorMessage(lang.noRole.replace("{prefix}", message.guild.settings.prefix));


            channeldb.forEach(async(s) => {

                await rrmodel.findOneAndDelete({ serverID: message.guild.id, _id: s._id });

            });
            return message.succesMessage(lang.deleteds);

        } else {

            return message.errorMessage(lang.noRole.replace("{prefix}", message.guild.settings.prefix));

        }

}



    },
};