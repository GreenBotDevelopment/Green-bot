const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'clear',
    description: 'supprime des messages du salon actuel',
    aliases: ['prune', 'purge'],
    usage: '<number> [user]',
    exemple: "5",
    usages: ["clear <number>", "clear <number> @user"],
    cat: 'moderation',
    guildOnly: true,
    args: true,
    permissions: ['MANAGE_MESSAGES'],
    botpermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],

    async execute(message, args) {
        let amount = args[0];
        if (!amount || isNaN(amount) || parseInt(amount) < 1) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "100"))
        }
        await message.delete();
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        let messages = await message.channel.messages.fetch({ limit: 100 });
        messages = messages.array();
        if (user) {
            messages = messages.filter((m) => m.author.id === user.id);
        }
        if (messages.length > amount) {
            messages.length = parseInt(amount, 10);
        }
        messages = messages.filter((m) => !m.pinned);
        amount++;
        message.channel.bulkDelete(messages, true);
        let toDel = null;
        const lang = await message.translate("CLEARE")
        if (user) {
            toDel = await message.channel.send(Discord.Util.removeMentions(lang.user.replace("{user}", user.user.username).replace("{amount}", --amount)))
        } else {
            toDel = await message.channel.send(Discord.Util.removeMentions(lang.base.replace("{amount}", --amount)))
        }
        setTimeout(function() {
            toDel.delete();
        }, 2000);
    },
};