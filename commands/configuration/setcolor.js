var hexColorRegex = require('hex-color-regex');
const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'setcolor',
    description: 'Défini la couleur des embeds du bot sur le serveur',
    usage: '<color>',
    args: true,
    cat: 'configuration',
    exemple: '#F0B02F',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("SET_COLOR")

        function hexColorCheck(a) {
            var check = hexColorRegex().test(a);
            var checkVerify = false;
            if (check == true) {
                checkVerify = true;
            }
            return checkVerify;
        }
        let color = args[0];
        var checkColor = hexColorCheck(color);
        if (checkColor == true) {
            const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { color: args[0] } }, { new: true });
            message.guild.settings.color = args[0]
            return message.mainMessageT(`:white_check_mark:  ${lang.ok.replace("{prefix}", args[0])}`)
        } else {
            message.errorMessage(lang.err)
        }
    },
};