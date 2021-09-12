const Discord = require('discord.js');
const config = require('../../config.js');
const moment = require('moment')
const Guild = require('../../database/models/guild');
const Canvas = require('canvas')
const { registerFont } = require('canvas');
registerFont('./ZenDots-Regular.ttf', { family: 'Zen Dots' })
const rolesReward = require('../../database/models/rolesRewards');
const premiumDB = require('../../database/models/premium');

const levelModel = require('../../database/models/level');
module.exports = {
        name: 'rank',
        description: 'Affiche votre rank sur le serveur',
        cooldown: 5,
        cat: 'levelling',
        async execute(message, args) {

            let member;
            if (args.length) {
                member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.includes(args[0].toLowerCase()) || m.user.username.includes(args[0].toLowerCase())).first()
            } else {
                member = message.member
            }
            if (!member) {

                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
            const lang = await message.translate("RANK")

            const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.user.id })
            if (!userdata) return message.errorMessage(lang.error)
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
            let color = Find ? Find.content : "3A871F";
            let Findx = await Guild.findOne({ serverID: member.user.id, reason: "rank_xp_color" })
            let colorxp = Findx ? Findx.content : "3A871F";
            const level = userdata.level;
            const xp = userdata.xp;
            const xpObjectif = 100;

            const xpBarre = Math.floor(xp / xpObjectif * 510);

            const canvas = Canvas.createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            ctx.font = '30px "Zen Dots"';
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(member.user.username, 175, 290);
            ctx.font = '25px "Zen Dots"';
            ctx.fillText(`#${member.user.discriminator}`, 175, 320);

            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.fillStyle = "#fff";
            ctx.moveTo(270, 175);
            ctx.quadraticCurveTo(270, 155, 300, 155);
            ctx.lineTo(750, 155);
            ctx.quadraticCurveTo(780, 155, 780, 175);
            ctx.quadraticCurveTo(780, 195, 750, 195);
            ctx.lineTo(300, 195);
            ctx.quadraticCurveTo(270, 195, 270, 175);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.fillStyle = `#${colorxp}`;
            ctx.moveTo(270, 175);
            ctx.quadraticCurveTo(270, 155, 300, 155);
            ctx.lineTo(270 + xpBarre - 30, 155);
            ctx.quadraticCurveTo(270 + xpBarre, 155, 270 + xpBarre, 175);
            ctx.quadraticCurveTo(270 + xpBarre, 195, 270 + xpBarre - 30, 195);
            ctx.lineTo(300, 195);
            ctx.quadraticCurveTo(270, 195, 270, 175);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.font = '20px "Zen Dots"';
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(`${xp} / ${xpObjectif}`, 525, 220)

            ctx.font = '30px "Zen Dots"';
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(`Level ${level}`, 420, 290)

            ctx.font = '30px "Zen Dots"';
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(`Rank ${usersTrier.findIndex(userTried) +1}`, 630, 290)

            ctx.beginPath();
            ctx.fillStyle = `#${color}`;
            ctx.arc(175, 175, 80, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(175, 175, 75, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(img);
            ctx.drawImage(avatar, 100, 100, 150, 150);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `newlevel-${member.id}.png`);


            const userv = await message.client.discordVoice.fetch(member.id, message.guild.id, true); // Selects the target from the database.

            const millisToMinutesAndSeconds = (millis) => {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                //ES6 interpolated literals/template literals 
                //If seconds is less than 10 put a zero in front.
                return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
            }
            let ranksLevel = await rolesReward.find({ serverID: message.guild.id, reason: 'level' })
            let symbol = await message.translate("LANGNAME")
            let nextRankLevel = null;
            ranksLevel.forEach((rank) => {
                let superior = (rank.level >= userdata.level);
                let found = member.guild.roles.cache.get(rank.roleID);
                let superiorFound = (nextRankLevel ? rank.level < nextRankLevel.level : true);
                if (superior && found && superiorFound) nextRankLevel = rank;
            });
            let embed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, img)
                .setImage(`attachment://newlevel-${member.id}.png`)
                .addField(lang.text, `**${lang.sendedMsg}** : \`${userdata.messagec}\`\n **${lang.level}** : \`${userdata.level}\`\n **XP** : \`${userdata.xp}\`\n**${lang.xp4.replace("{level}",userdata.level+1)}** : \`${100 - userdata.xp}\` `)
                .addField(lang.voc, `**${lang.tempVoc} :** \`${userv ? `${millisToMinutesAndSeconds(userv.data.voiceTime)} Minutes`  : "No data"}\` `)

        .addField(`📊 Leaderboard`, lang.ranked.replace("{username}",member.user.username).replace("{rank}",usersTrier.findIndex(userTried) +1).replace("{tot}",message.guild.memberCount))
            .setDescription(`⏰ ${lang.since.replace("{time}",moment(message.guild.me.joinedTimestamp).locale(symbol).fromNow())}  \n${lang.tip}\n ${nextRankLevel ? lang.next.replace("{role}",message.guild.roles.cache.get(nextRankLevel.roleID))  : ""}`)
            .setColor(message.guild.settings.color)
            .setFooter(message.client.footer)

            message.reply({embeds:[embed],files:[attachment], allowedMentions: { repliedUser: false } })
     


    },
};