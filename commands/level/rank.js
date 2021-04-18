const Discord = require('discord.js');
const config = require('../../config.json');
const moment = require('moment')
const Guild = require('../../database/models/guild');
const Voice = require("discord-voice");

const canvacord = require("canvacord");
const emoji = require('../../emojis.json')
const levelModel = require('../../database/models/level');
module.exports = {
        name: 'rank',
        description: 'Affiche votre rank sur le serveur',
        cooldown: 5 * 0,
        cat: 'level',
        async execute(message, args) {

            let member;
            if (args.length) {
                member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()

            } else {
                member = message.member
            }
            if (!member) {

                return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)

            }

            const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.user.id })
            if (!userdata) return message.errorMessage(`Cette personne n'a pas envoyé suffisament de message pour avoir des statistiques`)
            const users = await levelModel.find({ serverID: message.guild.id })
            const usersTrier = users.sort((a, b) => (a.messagec < b.messagec) ? 1 : -1)

            function estUser(user) {
                return user.userID === member.user.id;
            }
            const user = usersTrier.find(estUser);
            const userTried = (element) => element === user;
            usersTrier.findIndex(userTried)

            const img = member.user.displayAvatarURL({ format: 'png' });
            let Find = await Guild.findOne({ serverID: member.user.id, reason: "rank_color" })
            let color = Find ? Find.content : "#3A871F";
            let Findx = await Guild.findOne({ serverID: member.user.id, reason: "rank_xp_color" })
            let colorxp = Findx ? Findx.content : "#3A871F";
            let EditActive = await Guild.findOne({ serverID: message.guild.id, reason: `level_edit` })
            let url;
            url = `https://vacefron.nl/api/rankcard?username=${encodeURIComponent(
                member.user.username
      )}&avatar=${img}&level=${userdata.level}&rank=${usersTrier.findIndex(userTried) +1}&currentxp=${userdata.xp}&nextlevelxp=100&previouslevelxp=2&custombg=${color}&xpcolor${colorxp}&circleavatar=true`;



            const userv = await Voice.fetch(member.id, message.guild.id, true); // Selects the target from the database.

            const millisToMinutesAndSeconds = (millis) => {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                //ES6 interpolated literals/template literals 
                //If seconds is less than 10 put a zero in front.
                return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
            }
            const attachment = new Discord.MessageAttachment(url, 'rank.png')
            let embed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, img)
                .setImage('attachment://rank.png')
                .attachFiles(attachment)
                .addField(`✉ Statistiques Textuelles`, `**Messages envoyés** :\`${userdata.messagec}\`\n **Niveau** : \`${userdata.level}\`\n **XP** : \`${userdata.xp}\`\n**Xp pour le niveau ${userdata.level +1}** : \`${100 - userdata.xp}\` `)
                .addField(`🎙 Statistiques Vocales`, `**Temps en vocal :** \`${userv ? `${millisToMinutesAndSeconds(userv.data.voiceTime)} Minutes`  : "Aucunes données"}\` `)

        .addField(`📊 Classement`, `**${member.user.username}** est le \`${usersTrier.findIndex(userTried) +1}\` eme utilisateur le plus actif sur \`${message.guild.memberCount}\` membres`)
            .setDescription(`⏰ Statistiques depuis le  ${moment(message.guild.me.joinedTimestamp).locale('fr').format('LT ,')}  ${moment(message.guild.me.joinedTimestamp).locale('fr').fromNow()} \n🛠 Modifiez votre carte de rank sur le [Site](http://green-bot.xyz/rank)`)
            .setColor(message.client.color)
            .setFooter(message.client.footer)

                    message.channel.send(embed)
     


    },
};