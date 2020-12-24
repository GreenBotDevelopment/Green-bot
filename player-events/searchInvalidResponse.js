const emoji = require('../emojis.json');
module.exports = (client, message, query, tracks, content, collector) => {

    message.channel.send(`${emoji.error}  veuillez fournir un nombre entre **1** et **5**.`);

};