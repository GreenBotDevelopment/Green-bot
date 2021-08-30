const Discord = require('discord.js');
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Welcome = require('../../database/models/Welcome');


module.exports = {
    name: 'lyrics',
    description: 'Donne les paroles de la musique indiquée.',
    cat: 'music',
    args: true,
    usage: '<music>',
    exemple: 'Never gonna give you up',

    async execute(message, args) {

        const songName = args.join(" ");

        const err = await message.translate("LIRYCS")

        try {

            const songNameFormated = songName
                .toLowerCase()
                .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                .split(" ").join("%20");

            let res = await fetch(`https://www.musixmatch.com/search/${songNameFormated}`);
            res = await res.text();
            let $ = await cheerio.load(res);
            const songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

            res = await fetch(songLink);
            res = await res.text();
            $ = await cheerio.load(res);

            let lyrics = await $("p[class=\"mxm-lyrics__content \"]").text();

            if (lyrics.length > 2048) {
                lyrics = lyrics.substr(0, 2028) + '..' + " [Clique ici]" + `https://www.musixmatch.com/search/${songName}`;
            } else if (!lyrics.length) {
                return message.errorMessage(err.replace("{songName}", songName))
            }
            message.reply(`\`\`\`diff\n${songName}\n${lyrics.slice(0,2000)}\`\`\``)


        } catch (e) {
            return message.errorMessage(err.replace("{songName}", songName))

        }









    },
};