const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'g-start',
    description: 'Démarre un giveaway sur un salon donné',
    aliases: ['start-giveaway', 'giveaway-start'],
    guildOnly: true,
    args: true,
    usage: ' <temps> <nb de gagnants> <prix>',
    exemple: '#giveaways 2d 2 Un superbe bot en Discord.js',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        const currentGiveaways = message.client.manager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
        if (currentGiveaways > 0) {
            return message.channel.send(`${emoji.error} Vous avez déja un autre giveaway en cours sur ce serveur . veuillez d'abord y mettre fin.`)
        }
        const time = args[1];
        if (!time) {
            return message.channel.send(`${emoji.error} Veuillez fournir une date au giveaway . Pour de l'aide , faîtes \`help g-start\`.`)

        }
        if (isNaN(ms(time))) {
            return message.channel.send(`${emoji.error} Veuillez fournir une date valide pour ce giveaway , au format s/h/d/m.`)

        }
        if (ms(time) > ms("15d")) {
            return message.channel.send(`${emoji.error} La date ne doit pas dépasser 15 jours`)

        }
        const winnersCount = args[2];
        if (!winnersCount) {
            return message.channel.send(`${emoji.error} Veuillez fournir le nombre de gagnants . Pour de l'aide , faîtes \`help g-start\`.`)

        }
        if (isNaN(winnersCount) || winnersCount > 10 || winnersCount < 1) {
            return message.channel.send(`${emoji.error} Veuillez fournir un nombre de gagnants valide , plus grand que 1 et plus petit que 10.`)

        }
        const prize = args.slice(3).join(" ");
        if (!prize) {
            return message.channel.send(`${emoji.error} Veuillez mettre un prix au giveaway . Pour de l'aide , faîtes \`help g-start\`.`)

        }
        message.client.manager.start(channel, {
            time: ms(time),
            prize: prize,
            winnerCount: parseInt(winnersCount, 10),
            messages: {
                giveaway: "\n\n🎉🎉 **NOUVEAU GIVEAWAY**🎉🎉",
                giveawayEnded: "\n\n🎉🎉 **GIVEAWAY TERMINE**🎉🎉",
                timeRemaining: "`🕰`Temps restant: **{duration}**!",
                inviteToParticipate: "`➕`Réagissez avec 🎉 pour participer!\n `👑` Host par <@" + message.author + ">\n\n`🔢`" + winnersCount + " Gagnants",
                winMessage: "🎉 Félicitations, {winners} ! Vous gagnez **{prize}**!",
                embedFooter: "Giveaways",
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
        }).then(() => {
            message.channel.send(`${emoji.succes} Giveaway démarré avec succès`)
        });



    },
};
