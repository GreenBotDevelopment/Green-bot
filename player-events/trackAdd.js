const emoji = require('../emojis.json');
module.exports = (client, message, queue, track) => {

    message.channel.send(` ${emoji.succes} **${track.title}**  a été ajouté à la queue avec succès (**${queue.tracks.lenght}** musiques dans la queue).`);

};