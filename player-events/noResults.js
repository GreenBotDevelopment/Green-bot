const emoji = require('../emojis.json');
module.exports = (client, message, query) => {

    message.channel.send(`${emoji.error} Je n'a trouvé aucun résultats pour **${query}**`);

};