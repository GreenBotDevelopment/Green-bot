module.exports = {
    name: 'snipe',
    description: 'Sends the last message deleted in the current channel',
    permissions: ["MANAGE_MESSAGES"],
    cat: 'utilities',
    async execute(message, args, client, guildDB) {
        return message.errorMessage("The snipe command is currently disabled. Join the [Support server](https://discord.gg/SQsBWtjzTv) for more informations")

    },
};