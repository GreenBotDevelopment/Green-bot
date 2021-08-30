module.exports = {
    async execute(oldMessage, newMessage, client) {
        if (!newMessage.editedAt || !newMessage.member || !newMessage.guild || !newMessage.author.bot) return;
        client.emit("message", newMessage);
    }
};