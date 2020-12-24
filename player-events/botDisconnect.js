const emoji = require('../emojis.json');
module.exports = (client, message, queue) => {

    message.channel.send(`${emoji.error}  J'ai arreté la musique car on m'a éjecté du salon vocal......`);

};