const Discord = require('discord.js');
module.exports = {
    name: 'unbanall',
    description: 'Donne la liste des membres bannis du serveur',
    guildOnly: true,
    cat: 'moderation',

    aliases: ['ban-list'],
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["BAN_MEMBERS"],
    async execute(message, args, client) {
        const banList = await message.guild.bans.fetch({ cache: false })
        if (banList.size == 0) {
            let err = await message.translate("NO_BANS")
            return message.errorMessage(err)
        }
        const guild = message.guild
        let u = 0;

        function unBan(member) {
            setTimeout(async() => {
                message.guild.members.unban(member, { reason: "Unbanall command" }).catch(() => {
                    if (message.client.log) console.log(err);
                    return message.errorMessage(`Une erreur s'est produite , peut être les permissions`)
                })
            }, 900)
        }
        let embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#F0B02F")
            .setTitle(`UnbanAll`)
            .setDescription(`<a:green_loading:824308769713815612> Débanissement de tous les membres bannis en cours `)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({
            embeds: [embed],
            allowedMentions: { repliedUser: false }
        }).then((m) => {
            banList.forEach(banh => {
                u = u + 1
                let embed2;
                if (u == banList.size) {

                    embed2 = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                    .setColor("#F0B02F")
                        .setTitle(`UnbanAll`)
                        .setDescription(`✅ J'ai bien débanni les **${banList.size}** membres bannis du serveur !`)
                        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                } else {
                    embed2 = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                    .setColor("#F0B02F")
                        .setTitle(`UnbanAll`)
                        .setDescription(`<a:green_loading:824308769713815612> Débanissement de tous les membres bannis en cours (**${u}/${banList.size}**)`)
                        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                }


                m.edit({ embeds: [embed2] })
                unBan(banh.user.id)

            })



        })

















    },
};