const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const giveawayModel = require('../../database/models/giveaway');
const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me donner le **salon** dans lequel le giveaway aura lieu !",
    "Super ! et maintenant , combien de **temps** doit durer le giveaway ? au format d/m/s . Exemple : 1d, maximum 14 jours !",
    "Magnifique ! Mais combien de **gagnants** aura ce giveaway ( Entre 1 et 10 )",
    "Bien . Veuillez maintenant indiquer le prix du giveaway (Ce que recevront les gagnants) .",
    "Combien de messages doivent envoyer les utilisateurs pour participer ( Mettez 0 pour ignorer).",
    "Combien de personnes doivent inviter les personnes pour participer ?( Mettez 0 pour ignorer).",
]
module.exports = {
    name: 'g-start',
    description: 'Démarre un giveaway sur un salon donné',
    aliases: ['start-giveaway', 'giveaway-start', 'giveaway', 'create-giveway', 'gstart'],
    guildOnly: true,

    usage: ' <temps> <nb de gagnants> <prix>',
    exemple: '#giveaways 2d 2 Un superbe bot en Discord.js',
    cat: 'gway',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        const currentGiveaways = message.client.manager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
        if (currentGiveaways > 3 || currentGiveaways == 4) {
            return message.errorMessage(`Le nombre de giveaways maximum de giveaways par serveur a été atteint (4) Veuillez d'abord mettre fin à ces giveaways.`)
        }
        const response = await getResponses(message)
        let condition;
        if (response.invites && response.messages) {
            condition = `\`💬\` Vous devez envoyer **${response.messages}** Messages\n\`📩\` Vous devez avoir **${response.invites}** invitations`;
        } else {
            if (!response.invites && !response.messages) {
                condition = `\`⛔\` Aucunne condition`;

            } else {
                if (response.messages) {
                    condition = `\`💬\` Vous devez envoyer **${response.messages}** Messages`;
                }
                if (response.invites) {
                    condition = `\`📩\` Vous devez avoir **${response.invites}** Invitations`;
                }
            }

        }


        message.client.manager.start(response.channel, {
            time: response.time,
            prize: response.price,
            winnerCount: parseInt(response.winners, 10),
            embedColorEnd: message.client.color,
            messages: {
                giveaway: "\n\n🎉🎉 **NOUVEAU GIVEAWAY**🎉🎉",
                giveawayEnded: "\n\n🎉🎉 **GIVEAWAY TERMINE**🎉🎉",
                timeRemaining: "`🕰`Temps restant: **{duration}**!\n" + condition + "\n[Dashboard](http://green-bot.xyz/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=" + message.client.user.id + "&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot) -  [Documentation](https://docs.green-bot.xyz/)",
                inviteToParticipate: "`➕`Réagissez avec 🎁 pour participer !\n `👑` Host par <@" + message.author + ">\n`🔢`" + response.winners + " Gagnant(s)",
                winMessage: "🏆 Félicitations, {winners} ! Vous gagnez **{prize}**!\n{messageURL}",
                embedFooter: message.client.footer,
                noWinner: "Giveaway annulé , aucunne partcipation valide.",
                winners: "gagnant(s)",
                endedAt: "Finit le : ",
                units: {
                    seconds: "secondes",
                    minutes: "minutes",
                    hours: "heures",
                    days: "jours",
                    pluralS: false
                }
            }
        }).then((gData) => {
            message.succesMessage(`Super votre giveaway a démarré avec succès dans ${response.channel} ! Pour gérer les giveaways , voici les commandes disponibles : \`g-reroll\` , \`g-end\`... `);
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

            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessage(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content);
                    if (channel) {
                        responses.channel = channel;
                    } else {
                        return message.errorMessage(`Le salon indiqué est invalide , il faut mentionner le salon ou mettre son ID . Veuillez refaire la commande.`)
                        break;
                    }

                }
                if (i === 1) {
                    if (isNaN(ms(content))) {
                        return message.errorMessage(`Veuillez fournir une date valide pour ce giveaway , au format d/m/s . Exemple : 1d . Veuillez refaire la commande.`)
                        break;
                    } else {
                        if (ms(content) > ms("15d")) {
                            return message.errorMessage(`La date ne doit pas dépasser 15 jours . Veuillez refaire la commande.`)
                            break;
                        } else {
                            responses.time = ms(content);
                        }

                    }
                }
                if (i === 2) {
                    if (isNaN(content) || content > 10 || content < 1) {
                        return message.errorMessage(`Veuillez fournir un nombre de gagnants valide , plus grand que 1 et plus petit que 10. Veuillez refaire la commande.`)
                        break;
                    } else {
                        responses.winners = content;
                    }
                }
                if (i === 3) {
                    responses.price = content;
                }
                if (i === 4) {
                    if (content === '0') {
                        responses.messages = null;
                    } else {
                        if (isNaN(content) || content < 1 || m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {

                            return message.errorMessage(`Veuillez fournir un nombre de messages , plus grand que 1. Veuillez refaire la commande.`)
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
                            return message.message.errorMessage(`Veuillez fournir un nombre d'invitations plus grand que 0. Veuillez refaire la commande.`)
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