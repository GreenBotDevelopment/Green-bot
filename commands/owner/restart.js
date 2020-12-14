const emoji = require('../../emojis.json')
const config = require('../../config.json');
module.exports = {
    name: 'restart',
    description: 'Rédémarre le bot',
    owner: true,
    cat: 'owner',

    execute(message, args) {
        let bot = message.client;
        message.channel.send(`${emoji.loading} Rédémarage de \`${message.client.user.tag}\` en cours....`).then(() => bot.destroy()).then(() => bot.login(config.token)).then(() => message.channel.send(`${emoji.succes} Le bot a redémarré avec succès`))


    },
};