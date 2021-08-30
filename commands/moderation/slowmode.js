const Discord = require('discord.js');
module.exports = {
    name: 'slowmode',
    description: `
    Active le mode lent dans un salon avec le taux spécifié.
    Si aucun salon n'est fourni, le mode lent affectera le salon actuel.
    Fournissez un taux de 0 pour désactiver.      `,
    aliases: ['slow'],
    guildOnly: true,
    args: true,
    usage: '[channel] number [reason]',
    usages: ["slowmode <time>", "slowmode #channel <time>", "slowmode #channel <time> <reason>", "slowmode <time> <reason>"],
    exemple: '10',
    cat: 'moderation',
    botpermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
    permissions: ['MANAGE_CHANNELS'],
    async execute(message, args, client) {
        let index = 1;
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            channel = message.channel;
            index--;
        }
        if (!channel || channel.type !== 'GUILD_TEXT' || !channel.viewable) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)
        }
        const rate = args[index].replace("s", "");
        if (!rate || isNaN(rate) || rate < 0 || rate > 59) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "0").replace("{range}", "59"))
        }
        if (rate.includes('-') || rate.includes('+') || rate.includes(',') || rate.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "0").replace("{range}", "59"))
        }
        if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS'])) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)
        }
        let reason = args.slice(index + 1).join(' ');
        if (!reason) reason = 'No reason provided (executed by ' + message.member.user.username + ')';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
        await channel.setRateLimitPerUser(rate, reason);
        const lang = await message.translate("SLOWMODE")
        if (rate === '0') {
            return message.succesMessage(lang.desa);
        } else {
            return message.succesMessage(lang.ok);
        }
    },
};