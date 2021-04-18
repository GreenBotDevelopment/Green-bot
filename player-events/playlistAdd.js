const emoji = require('../emojis.json');
module.exports = (client, message, playlist) => {

    message.mainMessage(`J'ai bien ajouté la playlist ${playlist.title} à la queue `);

};