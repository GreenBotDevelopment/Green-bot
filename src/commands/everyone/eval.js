const BaseCommand = require("../../abstract/BaseCommand.js"),
    KongouDispatcher = require("../../modules/KongouDispatcher.js"),
    util = require("util"),
    Discord = require("discord.js");
class Queue extends BaseCommand {
    get name() {
        return "eval";
    }
    get description() {
        return "Sends in DM the current track";
    }
    get playerCheck() {
        return { premium: !0 };
    }
    async run({ ctx: e }) {
        if ("688402229245509844" !== e.author.id && "772850214318768138" !== e.author.id) return e.errorMessage("Pay 4342323,000 dollars to <@688402229245509844> to use this command.");
        var code = e.args.join(" ");
        try {
            const ev = await eval(code);
            let str = util.inspect(ev, { depth: 1 });
            (str = `${str.replace(new RegExp(`${e.client.token}`, "g"), "TOKEN")}`),
                str.length > 1914 && ((str = str.substr(0, 1914)), (str += "...")),
                code.length > 1914 && ((code = code.substr(0, 1914)), (code = "Bruh, your code is very long."));
            const embed = new Discord.MessageEmbed()
                .setDescription(`\`\`\`js\n${clean(str)}\n\`\`\``)
                .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                .addField("Type of:", typeof str);
            e.channel.send({ embeds: [embed], allowedMentions: { repliedUser: !1 } });
        } catch (r) {
            const t = new Discord.MessageEmbed()
                .setDescription(`\`\`\`js\n${r}\n\`\`\``)
                .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                .addField("Type of:", typeof str);
            e.channel.send({ embeds: [t], allowedMentions: { repliedUser: !1 } });
        }
        function clean(e) {
            return "string" == typeof e ? e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : e;
        }
    }
}
module.exports = Queue;