const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const giveawayModel = require('../../database/models/giveaway');
const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me donner le **salon** dans lequel le giveaway aura lieu !",
    "Super ! et maintenant , combien de **temps** doit durer le giveaway ?  au format d/h/m/s , maximum 14 jours !",
    "Magnifique ! Mais combien de **gagnants** aura ce giveaway ( Entre 1 et 10 )",
    "Bien . Veuillez maintenant indiquer le prix du giveaway (ce que recevront les gagnants) .",
    "Combien de messages doivent envoyer les utilisateurs pour participer (mettez 0 pour ignorer).",
]
module.exports = {
    name: 'g-start',
    description: 'Démarre un giveaway sur un salon donné',
    aliases: ['start-giveaway', 'giveaway-start'],
    guildOnly: true,

    usage: ' <temps> <nb de gagnants> <prix>',
    exemple: '#giveaways 2d 2 Un superbe bot en Discord.js',
   cat: 'gway',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        const currentGiveaways = message.client.manager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
        if (currentGiveaways > 0) {
            return message.channel.send(`${emoji.error} Vous avez déja un autre giveaway en cours sur ce serveur . veuillez d'abord y mettre fin.`)
        }
        const response = await getResponses(message)
        let condition;
        if (response.messages) {
            condition = `Vous devez envoyer **${response.messages}** Messages`;
        } else {
            condition = `Aucunne condition`;
        }
        message.client.manager.start(response.channel, {
            time: response.time,
            prize: response.price,
            winnerCount: parseInt(response.winners, 10),
            embedColorEnd: '#2f3136',
            messages: {
                giveaway: "\n\n🎉🎉 **NOUVEAU GIVEAWAY**🎉🎉",
                giveawayEnded: "\n\n🎉🎉 **GIVEAWAY TERMINE**🎉🎉",
                timeRemaining: "`🕰`Temps restant: **{duration}**!\n`💱` " + condition + "  \n\n __Liens utiles__\n   [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=" + message.client.user.id + "&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)",
                inviteToParticipate: "`➕`Réagissez avec 🎉 pour participer !\n `👑` Host par <@" + message.author + ">\n`🔢`" + response.winners + " Gagnant(s)",
                winMessage: "🎉 Félicitations, {winners} ! Vous gagnez **{prize}**!",
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
            message.channel.send(`${emoji.succes} Super votre giveaway a démarré avec succès dans ${response.channel} ! Pour gérer les giveaways , voici les commandes disponibles : \`g-reroll\` , \`g-end\`... `);
            if (response.messages) {
                const verynew = new giveawayModel({
                    serverID: `${gData.serverID}`,
                    messageID: `${gData.messageID}`,
                    requiredMessages: `${response.messages}`,
                }).save()
            }

        });


        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}

            for (let i = 0; i < prompts.length; i++) {
                await message.channel.send(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content);
                    if (channel) {
                        responses.channel = channel;
                    } else {
                        message.channel.send(`${emoji.error} Le salon indiqué est invalide , il faut mentionner le salon ou mettre son ID . Veuillez refaire la commande.`)
                        break;
                    }

                }
                if (i === 1) {
                    if (isNaN(ms(content))) {
                        message.channel.send(`${emoji.error} Veuillez fournir une date valide pour ce giveaway , au format s/h/d/m. Veuillez refaire la commande.`)
                        break;
                    } else {
                        if (ms(content) > ms("15d")) {
                            message.channel.send(`${emoji.error} La date ne doit pas dépasser 15 jours . Veuillez refaire la commande.`)
                            break;
                        } else {
                            responses.time = ms(content);
                        }

                    }
                }
                if (i === 2) {
                    if (isNaN(content) || content > 10 || content < 1) {
                        message.channel.send(`${emoji.error} Veuillez fournir un nombre de gagnants valide , plus grand que 1 et plus petit que 10. Veuillez refaire la commande.`)
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
                        if (isNaN(content) || content < 1) {
                            message.channel.send(`${emoji.error} Veuillez fournir un nombre de messages , plus grand que 1. Veuillez refaire la commande.`)
                            break;
                        } else {
                            responses.messages = content;
                        }
                    }
                }
            }
            return responses;
        }
    },
};
