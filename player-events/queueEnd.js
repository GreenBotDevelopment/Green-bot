const emoji = require('../emojis.json');
module.exports = (client, message, queue) => {

    message.channel.send(`${emoji.error} - J'ai arreté la musique car la queue est vide  !`);

};
