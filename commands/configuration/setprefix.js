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
        const lang = await message.translate("SET_PREFIX", guildDB.lang)
        let prefix = args.join("")
        if (prefix === "default" || prefix === "reset") prefix = "*"
        if (prefix.length > 4 || prefix.length < 0) return message.errorMessage(lang.err.replace("{prefix}", prefix));
        if (prefix.startsWith("<") && prefix.endsWith(">")) return message.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + guildDB.prefix + "setprefix !`")
        if (prefix === guildDB.prefix) return message.errorMessage(lang.already)
        guildDB.prefix = prefix;
        guildDB.save()
        return message.succesMessage(lang.ok.replace("{prefix}", args[0]).replace("{prefix}", args[0]))
    },
};