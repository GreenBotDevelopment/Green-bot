const emoji = require('../emojis.json');
module.exports = (client, message, query, tracks, content, collector) => {
    if (content === 'cancel') {
        collector.stop()
        return message.succesMessage(`Recherche annulée avec succès `)
    }
    message.errorMessage(`veuillez fournir un nombre entre **1** et **5**.`);

};