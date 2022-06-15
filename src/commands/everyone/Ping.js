const BaseCommand = require("../../abstract/BaseCommand.js");
class Ping extends BaseCommand {get name() { return "ping" }
    get category() { return "Everyone Commands" }get description() { return "Basic ping command!" }
    run({ ctx: e }) { e.channel.send("**Pinging...**").then(n => { n.edit({ embeds: [{ author: { name: "Bot latency", icon_url: e.member.user.displayAvatarURL({ dynamic: !0, size: 512 }) }, description: `**Message ping**: \`${Date.now()-n.createdTimestamp-39}ms\`\n**Discord latency**: \`${e.client.ws.ping}ms\``, color: "#3A871F", footer: { text: "• Get more informations at green-bot.app/status", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) } }], content: null }) }) } }
module.exports = Ping;