const Discord = require('discord.js');
const { parse } = require("twemoji-parser");
const Welcome = require('../../database/models/Welcome');
const prompts = [
    "Bonjour ! commencez par me dire si je doit activer ou désactiver le système de vérification . \n Répondez par (**enable** ou **disable**) !",
    "Super ! et maintenant , donnez moi l'ID du message ou , quand un personne réagira , elle sera vérifiée. Le message doit être de ce salon .\n",
    "Magnifique ! et maintenant, quelle est la réaction , qui une fois ajoutée donnera le rôle au membre",
    "Bien . Quel rôle je vais devoir ajouter aux membres une fois qu'ils ont réagit ?",
]
module.exports = {
        name: 'verification',
        description: 'Active ou désactive le système de vérification sur le serveur',
        cat: 'antiraid',
        exemple: 'on',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const ID = message.member.id;
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `verification` })
            let tip = await message.translate("DASHBOARD")
            let second = await message.translate("ARGS_TIP")
            let cfg = await message.translate("ACTUAL_CONFIG")
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`Verification system`)
                .setDescription(tip)
                .addField(cfg.title, `${cfg.enabled}${verify ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\n Role : ${verify ? verify.image ? `<@&${verify.image}>` : cfg.no: cfg.no}\nMessage ID: ${verify ? verify.channelID ? `${verify.channelID}` : cfg.no: cfg.no}\nReaction : ${ verify ? verify.message ? `${verify.message}` : cfg.no: cfg.no}`)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 }).then((m) => {
                        m.react("📜")
                        const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
                        const collector = m.createReactionCollector({ filter, time: 1000000, max: 1 });
                        collector.on('collect', async r => {
                            const response = await getResponses(message)
                            if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
                            const a = await message.translate("CONFIG_OK")
                            let b = await message.gg("the verification system")
                            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `verification` })
                            if (verify) {
                                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `verification` }, { $set: { channelID: response.message, reason: `verification`, message: response.emoji, image: response.roleID, } }, { new: true });
                                message.succesMessage(a.replace("{x}", b));
                            } else {
                                const verynew = new Welcome({
                                    serverID: `${message.guild.id}`,
                                    channelID: `${response.message}`,
                                    reason: 'verification',
                                    message: `${response.emoji}`,
                                    image: `${response.roleID}`,
                                }).save();
                                message.succesMessage(a.replace("{x}", b));

                            }
                        });
                        collector.on('end', collected => m.reactions.removeAll());




                    });




                    async function getResponses(message) {
                        const validTime = /^\d+(s|m|h|d)$/;
                        const validNumber = /^\d+/;
                        const responses = {}
                        let can = await message.translate("CAN_CANCEL")
                        for (let i = 0; i < prompts.length; i++) {
                            let goodText = await message.gg(prompts[i])
                            await message.mainMessageT(`${goodText}\n\n${can}`);
                            const filter = m => m.author.id === ID;
                            const response = await message.channel.awaitMessages({ filter, max: 1, })
                            const { content } = response.first();
                            const m = response.first();
                            if (content.toLowerCase() === "cancel") {
                                let okk = await message.translate("CANCELED")
                                responses.cancelled = true;

                                message.channel.send(`**${okk}**`)
                                return responses;

                                break;
                            }
                            let chan;
                            if (i === 0) {
                                const ll = await message.translate("ENA/DISA")

                                if (content.toLowerCase() === 'enable') {
                                    responses.status = true;
                                } else if (content.toLowerCase() === 'disable') {
                                    responses.status = null;

                                    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `verification` })
                                    if (verify) {
                                        const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `verification` });

                                        return message.succesMessage(ll.succes);


                                    }
                                    return message.succesMessage(ll.disable);


                                } else {
                                    return m.errorMessage(ll.err)

                                }

                            }
                            if (i === 1) {

                                let suggM = message.channel.messages.fetch(content).then(async msg => {
                                        responses.message = msg.id
                                        chan = msg.channel

                                    })
                                    .catch(err => {
                                        return m.errorMessage(`The message must be from this channel`)
                                    })


                            }
                            if (i === 2) {
                                const lange = await message.translate("ROLEREACT")

                                let customemoji = Discord.Util.parseEmoji(content);
                                if (customemoji.id) {
                                    return m.errorMessage(lange.addCustom);
                                    break;

                                } else {
                                    let CheckEmoji = parse(content, { assetType: "png" });
                                    if (!CheckEmoji[0]) {
                                        return m.errorMessage(lange.emojiErr)
                                    break;

                                    }
                                    responses.emoji = content;

                                }

                            }
                            if (i === 3) {
                                let role = m.mentions.roles.first() || message.guild.roles.cache.get(content);
                                if (!role || role.name == "@everyone" || role.managed) {
                                    let err = await message.translate("ERROR_ROLE")
                                    return m.errorMessage(err);
                                    break;
                                } else {

                                    responses.roleID = role.id;
                                }


                            }
                            
                        }


                        return responses;
                    }











                },
        };