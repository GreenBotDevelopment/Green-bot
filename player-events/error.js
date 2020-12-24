const emoji = require('../emojis.json');
module.exports = (client, error, message) => {

    switch (error) {
        case 'NotPlaying':
            message.channel.send(`${emoji.error} Je ne joue actuellement aucunne musique`);
            break;
        case 'NotConnected':
            message.channel.send(`${emoji.error}  Veuillez d'abord rejoindre un salon vocal`);
            break;
        case 'UnableToJoin':
            message.channel.send(`${emoji.error} Je n'ai pas les permissions de rejoindre ce salon`);
            break;
        default:
            message.channel.send(`${emoji.error} Désolé , une erreur est survenue......`);
    };

};