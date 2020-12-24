const emoji = require('../emojis.json');
module.exports = (client, message, query, tracks) => {

    message.channel.send(`${emoji.error}  Vous n'avez pas fourni de bonne réponse , veuillez refaire la commande.`);

};