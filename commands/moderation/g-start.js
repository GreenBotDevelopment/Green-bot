const Discord = require('discord.js');
const ms = require('ms');
const giveawayModel = require('../../database/models/giveaway');

module.exports = {
    name: 'gstart',
    description: 'Démarre un giveaway sur un salon donné',
    aliases: ['start-giveaway', 'giveaway-start', 'giveaway', 'create-giveway', 'g-start'],
    guildOnly: true,

    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const ID = message.member.id;

        const currentGiveaways = message.client.manager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
        if (currentGiveaways > 3 || currentGiveaways == 4) {
            let bb = await message.translate("GIVEAWAY_MAX")
            return message.errorMessage(bb)
        }
        const prompts = await message.translate("GIVEAWAY_PROMPTS")
        const response = await getResponses(message)
        if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null

        const infos = await message.translate("GIVEAWAY_INFOS")

        let condition;
        if (response.invites && response.messages) {
            condition = `${infos.requirementDouble.replace("{messages}", response.messages).replace("{count}", response.invites)}\n\n`;
        } else {
            if (!response.invites && !response.messages) {
                condition = "";

            } else {
                if (response.messages) {
                    condition = `${infos.requirementMessage.replace("{messages}", response.messages)}\n\n`;
                }
                if (response.invites) {
                    condition = `${infos.requirementInvite.replace("{messages}", response.invites)}\n\n`;
                }
            }

        }
        let succesM = await message.translate("GIVEAWAY_SUCCES")
        message.succesMessage(succesM.replace("{channel}", response.channel));

        message.client.manager.start(response.channel, {
            time: response.time,
            prize: response.price,
            winnerCount: parseInt(response.winners, 10),
            embedColorEnd: "#ED360E",
            messages: {
                giveaway: "\n\n<:greenbotsourire1:811148362526883860> **GIVEAWAY** <:greenbotsourire1:811148362526883860>",
                giveawayEnded: "\n\n<:greenbotsourire1:811148362526883860> **GIVEAWAY ENDED** <:greenbotsourire1:811148362526883860>",
                timeRemaining: "• " + infos.rest + ": \`{duration}\`!\n" + condition + "[" + infos.invite + "](https://discord.com/oauth2/authorize?client_id=" + message.client.user.id + "&scope=bot&permissions=8) • [" + infos.vote + "](https://top.gg/bot/783708073390112830/vote)",
                inviteToParticipate: "• " + infos.enter + "\n \n • " + infos.host + " \`" + message.author.username + "\`\n•\`" + response.winners + "\` " + infos.winners + "",
                winMessage: infos.congrats,
                embedFooter: infos.end,
                noWinner: "" + infos.error + "\n\n" + infos.host + " \`" + message.author.username + "\`\n",
                winners: "🏆 " + infos.winners + "",
                endedAt: infos.end,
                units: {
                    seconds: infos.seconds,
                    minutes: infos.minutes,
                    hours: infos.hours,
                    days: infos.days,
                    pluralS: false
                }
            }
        }).then((gData) => {
            if (response.invites && response.messages) {
                const verynew = new giveawayModel({
                    serverID: `${gData.guildID}`,
                    MessageID: `${gData.messageID}`,
                    requiredMessages: `${response.messages}`,
                    requiredInvites: `${response.invites}`
                }).save()

            } else {
                if (!response.invites && !response.messages) {

                } else {
                    if (response.messages) {
                        const verynew = new giveawayModel({
                            serverID: `${gData.guildID}`,
                            MessageID: `${gData.messageID}`,
                            requiredMessages: `${response.messages}`,
                        }).save()

                    }
                    if (response.invites) {
                        const verynew = new giveawayModel({
                            serverID: `${gData.guildID}`,
                            MessageID: `${gData.messageID}`,
                            requiredInvites: `${response.invites}`
                        }).save()
                    }
                }

            }
            if (response.messages) {
                const verynew = new giveawayModel({
                    serverID: `${gData.guildID}`,
                    MessageID: `${gData.messageID}`,
                    requiredMessages: `${response.messages}`,
                }).save()
            }
        });


        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}
            let can = await message.translate("CAN_CANCEL")
            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessageT(`${prompts[i]}\n\n${can}`);
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
                if (i === 0) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'GUILD_TEXT' && channel.guild.id === message.guild.id) {
                        if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
                            let a = await message.translate("CHANNEL_PERMS")
                            return m.errorMessage(a)
                            break;
                        }
                        responses.channel = channel;
                    } else {
                        let errorChannel = await message.translate("ERROR_CHANNEL")
                        return m.errorMessage(errorChannel)
                        break;
                    }
                }
                if (i === 1) {
                    if (!content || isNaN(ms(content))) {
                        return m.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir une durée valide. Veuillez refaire la commande":"Please provide a valid duration. Please do the command again"}`)
                        break;

                    }
                    if (ms(content) > ms("30d") || content.includes("-") || content.includes("+") || content.includes(",") || content.includes(".") || content.startsWith("0")) {
                        return m.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir une durée valide. Le maximum est30j. Veuillez refaire la commande":"Please provide a valid duration. The max is 30 days.Please do the command again"}`)
                        break;


                    }
                    responses.time = ms(content)
                }
                if (i === 2) {
                    if (isNaN(content) || content < 1 || content > 10 || m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {
                        let numberErr = await message.translate("NUMBER_ERROR")
                        return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "10"))
                        break;
                    } else {
                        responses.winners = content;
                    }
                }
                if (i === 3) {
                    if (content < 2 || content > 1000) {
                        let numberErr = await message.translate("MESSAGE_ERROR")
                        return m.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "1000"))
                        break;
                    }
                    responses.price = content;
                }
                if (i === 4) {
                    if (content === '0') {
                        responses.messages = null;
                    } else {
                        if (isNaN(content) || content < 1 || m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {

                            let numberErr = await message.translate("NUMBER_ERROR")
                            return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
                            break;
                        } else {
                            responses.messages = content;
                        }
                    }
                }
                if (i === 5) {
                    if (content === '0') {
                        responses.invites = null;
                    } else {
                        if (isNaN(content) || content < 1 || m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {
                            let numberErr = await message.translate("NUMBER_ERROR")
                            return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
                            break;
                        } else {
                            responses.invites = content;
                        }
                    }
                }


            }
            return responses;
        }
    },
};