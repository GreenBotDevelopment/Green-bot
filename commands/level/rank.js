const Discord = require('discord.js');
const config = require('../../config.json');
const canvacord = require("canvacord");
const emoji = require('../../emojis.json')
const levelModel = require('../../database/models/level');
module.exports = {
    name: 'rank',
    description: 'Affiche votre rank sur le serveur',

    cat: 'level',
    async execute(message, args) {

        const member = message.mentions.members.last() || message.member;

        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })


        const img = message.author.displayAvatarURL({ format: 'png' });


        const rank = new canvacord.Rank()
            .setAvatar(img)
            .setCurrentXP(userdata.xp)
            .setRequiredXP(100)
            .setRank(userdata.messagec, "Messages :")
            .setLevel(userdata.level, "Niveau ")
            .setStatus("dnd")
            .renderEmojis(true)
            .setOverlay("#4F8353")
            .setCustomStatusColor("#4F8353")
            .setBackground("COLOR", "#4F8353")
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator);
        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                message.channel.send(attachment);
            });





    },
};