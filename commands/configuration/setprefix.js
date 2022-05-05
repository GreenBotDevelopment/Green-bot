module.exports = {
    name: 'setprefix',
    description: 'Sets the bot prefix',
    usage: '<prefix>',
    args: true,
    cat: 'configuration',
    exemple: '!',
    cooldown: 15,
    aliases: ["prefix"],
    permissions: ['MANAGE_GUILD'],
    async execute(message, args, client, guildDB) {
        const lang = await message.translate("SET_PREFIX", guildDB.lang);
        const prefix = args.join("");
        if (!prefix || prefix === "default" || prefix === "reset") prefix = client.config.prefix;
        if (prefix.length >= 5) return message.errorMessage(lang.err.replace("{prefix}", prefix));
        if (prefix.startsWith("[") && prefix.endsWith("]") || prefix.startsWith(":") && prefix.endsWith(":") || prefix.startsWith("<") && prefix.endsWith(">")) return message.errorMessage(`Hooks such as \`[]\`, \`:emoji:\` or \`<>\` must not be used when executing commands. Ex: \`${guildDB.prefix}setprefix !\`.`);
        if (prefix === guildDB.prefix) return message.errorMessage(lang.already);
        guildDB.prefix = prefix;
        guildDB.save();
        return message.succesMessage(lang.ok.replace("{prefix}", prefix).replace("{prefix}", prefix))
    },
};
