const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'mute',
    description: 'Réduit au silence un membre pour un temps donné.',

    guildOnly: true,
    args: 'user',
    usage: '@user <temps>',
    exemple: '@pauldb09 23s',
    cat: 'moderation',
    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {


        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (user.id === message.author.id) {
            return message.channel.send(`${emoji.error} Vous ne pouvez pas vous muter vous même !`)
        }



        // Gets the ban reason
        let reason = args.slice(2).join(" ");
        if (!reason) {
            reason = 'Aucunne raison donnée';
        }

        const member = await message.guild.members.fetch(user.id).catch(() => {});
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
                return message.channel.send(`${emoji.error} Cette personne est plus haute que vous dans la hiérachie !`)

            }
            if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${emoji.error} Mute une personne qui a la permission \`ADMINISTRATEUR\` n'aura aucun effet ! `);


        }
        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (user.roles.cache.has(role.id)) return message.channel.send(`${emoji.error} Cette personne est déja mute....`);

        if (!args[1])
            return message.channel.send(`${emoji.error} Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);
        let time = ms(args[1]);
        if (!time || time > 1209600000)
            return message.channel.send(`${emoji.error} Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);

        await user.send(`Bonjour **${user.user.tag}**, Vous avez été mute sur **${message.guild.name}** pour la raison **${reason}**. Votre mute dure **${args[1]}**.`).catch(() => {});




        if (!role) {
            try {
                role = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#000000",
                        permissions: []
                    }
                });

                message.guild.channels.cache.forEach(async(channel, id) => {
                    await channel.createOverwrite(role, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        READ_MESSAGES: false,
                        CONNECT: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        try {
            user.roles.add(role);
            message.channel.send(`${emoji.succes} **${user.user.tag}** a été réduit au silence sur le serveur pour une durée de **${args[1]}**`);

        } catch (err) {
            message.channel.send(`${emoji.error} Je n'ai pas réussi à mute ce membre , veuillez vérifier la hiérarchie.`);

        }

        setTimeout(() => {
            user.roles.remove(role)
            const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle('Un membre viens d\'être démute')
            .setDescription(`${member} a été unmute. Son mute a duré ${time}`)
            .setFooter(message.client.footer)
            .setTimestamp()
            .setColor("#2f3136");
          message.channel.send(unmuteEmbed);
        }, time);



    },
};
