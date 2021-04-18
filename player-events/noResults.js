const emoji = require('../emojis.json');
module.exports = (client, message, query) => {

    message.errorMessage(`Je n'a trouvé aucun résultats pour **${query}**`);

};