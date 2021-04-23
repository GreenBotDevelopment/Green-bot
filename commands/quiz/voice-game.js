const Discord = require('discord.js');

const discordTTS = require("discord-tts");
const emoji = require('../../emojis.json')
const fetch = require("node-fetch");

module.exports = {
        name: 'voice-games',
        description: 'Fait des jeux dans un salon vocal',
        cat: 'musique',
        args: true,
        alaises: ["youtube-together"],
        usage: '<channel> <activitée>',
        exemple: '811174924693143564 youtube',
        botpermissions: ['CONNECT', 'SPEAK'],

        async execute(message, args) {



            const ACTIVITIES = {
                "poker": {
                    id: "755827207812677713",
                    name: "Poker Night"
                },
                "betrayal": {
                    id: "773336526917861400",
                    name: "Betrayal.io"
                },
                "youtube": {
                    id: "755600276941176913",
                    name: "YouTube Together"
                },
                "fishington": {
                    id: "814288819477020702",
                    name: "Fishington.io"
                }
            };



            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!channel || channel.type !== "voice") return message.errorMessage(`Vous devez fournir un salon vocal valide`);
            if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.errorMessage(`Vous devez fournir un salon vocal valide ou j'ai les permissions !`);
            const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
            if (!activity) return message.errorMessage(`Je n'ai pas cette application. Applications supportées :\n${Object.keys(ACTIVITIES).map(m => `\`${m}\``).join("\n")}`);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: activity.id, // youtube together
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${message.client.token}`,
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.errorMessage("Une erreur est survenue , vérifiez les permissions !");
                message.mainMessage(`📻 [Cliquez ici](<https://discord.gg/${invite.code}>) pour démarrer \`${activity.name}\` dans ${channel} .`);
            })
            .catch(e => {
                return message.errorMessage("Une erreur est survenue , vérifiez les permissions !");
            })


        // or use this







    },
};