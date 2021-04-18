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


        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()

        if (user.id === message.author.id) {
            return message.errorMessage(`Vous ne pouvez pas vous muter vous même !`)
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
            if (message.guild.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
                return message.errorMessage(`Cette personne est plus haute que vous dans la hiérachie !`)

            }
            if (user.permissions.has("ADMINISTRATOR")) return message.errorMessage(`Mute une personne qui a la permission \`ADMINISTRATEUR\` n'aura aucun effet ! `);


        }
        let role = message.guild.roles.cache.find(role => role.name === "Muted");

        if (role) {
            if (user.roles.cache) {
                if (user.roles.cache.has(role.id)) return message.errorMessage(`Cette personne est déja réduite au silence sur le serveur.`);
            }
        }
        if (!args[1])
            return message.errorMessage(`Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);
        let time = ms(args[1]);
        if (!time || time > 1209600000)
            return message.errorMessage(`Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);

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
            message.succesMessage(`**${user.user.tag}** a été réduit au silence sur le serveur pour une durée de **${args[1]}**`);

        } catch (err) {
            message.errorMessage(`Je n'ai pas réussi à mute ce membre , veuillez vérifier la hiérarchie.`);

        }

        setTimeout(() => {
            user.roles.remove(role)
            message.mainMessage(`Le mute de ${user} a prit fin , il a duré **${args[1]}**`)
        }, time);



    },
};