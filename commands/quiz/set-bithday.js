const Discord = require('discord.js');
const birthday = require('../../database/models/birthday');
const moment = require("moment");

module.exports = {
    name: 'birthday',
    description: 'Configure la date de votre anniversaire',
    aliases: ['set-birthday'],
    cooldown: 10,
    cat: 'games',
    usage: 'JJ/MM/AAAA',
    exemple: '23/07/1978',
    args: true,
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const date = args[0];
        const lang = await message.translate("SET_BIRTHDAY")
        const tArgs = date.split("/");
        const [day, month, year] = tArgs;
        if (!day || !month || !year) {
            message.errorMessage(lang.date)
            return
        }
        const match = date.match(/\d+/g);
        if (!match) {
            message.errorMessage(lang.date)
            return
        }
        const tday = +match[0],
            tmonth = +match[1] - 1;
        let tyear = +match[2];
        if (tyear < 100) {
            tyear += tyear < 50 ? 2000 : 1900;
        }
        const d = new Date(tyear, tmonth, tday);
        if (!(tday == d.getDate() && tmonth == d.getMonth() && tyear == d.getFullYear())) {
            message.errorMessage(lang.date)
            return
        }
        if (d.getTime() > Date.now()) {
            message.errorMessage(lang.old)
            return
        }
        if (d.getTime() < (Date.now() - 3.523e+12)) {
            return message.errorMessage(lang.big)
        }
        let find = await birthday.findOne({ userID: message.author.id })
        if (find) {
            let finde = await birthday.findOneAndUpdate({ userID: message.author.id }, { $set: { Date: d } }, { new: true })
            message.succesMessage(lang.succes.replace("{date}", moment(d).locale(message.guild.settings.lang).format("Do MMMM")))
            return;
        } else {
            let crt = new birthday({
                userID: `${message.author.id}`,
                Date: `${d}`
            }).save()
            message.succesMessage(lang.succes.replace("{date}", moment(d).locale(message.guild.settings.lang).format("Do MMMM")))
            return;
        }
    },
};