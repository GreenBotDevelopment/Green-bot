const KongouCommand = require("../../abstract/KongouCommand.js"),
    fetch = require("node-fetch");
class Premium extends KongouCommand {
    get name() {
        return "premium";
    }
    get arguments() {
        return [
            {
                name: "action",
                type: 3,
                required: !0,
                choices: [
                    { name: "activate", value: "activate" },
                    { name: "deactivate", value: "deactivate" },
                    { name: "status", value: "status" },
                ],
                description: "The action you want to do: status, activate or deactivate",
            },
        ];
    }
    get category() {
        return "Everyone Commands";
    }
    get description() {
        return "Shows your premium status";
    }
    get aliases() {
        return ["pr"];
    }
    static invite(e) {
        return `https://discord.com/api/oauth2/authorize?client_id=${e}&permissions=139623484672&scope=bot%20applications.commands`;
    }
    async run({ ctx: e }) {
        let r = e.args[0].value;
        const t = e.premiumlink("premiumUser") + "userId=" + e.member.id,
            i = await fetch(t).catch((r) => e.logger.error(r)),
            o = await i.json(),
            u = e.premiumlink("premiumGuild") + "guildId=" + e.guild.id,
            a = await fetch(u).catch((r) => e.logger.error(r)),
            s = await a.json();
        if (!["status", "activate", "active", "deactivate"].includes(r)) return e.errorMessage("Please provide a valid action: status, activate or deactivate");
        if (r)
            if ("status" === r) {
                if (!o) return e.errorMessage("You don't have a premium subscribtion yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                e.reply({
                    embeds: [
                        {
                            author: { name: "Green-Bot Premium", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }), url: "https://discord.com/oauth2/authorize?client_id=901466922820988968&scope=bot&permissions=19456" },
                            description: "Your Premium Subscribtion Status",
                            fields: [
                                {
                                    name: "Status",
                                    value: `${
                                        o
                                            ? "✅ You currently have the premium\n\n**Tier**: " + o.tier + "\n**Guilds left**: " + o.guildsLeft + `${o.expires?`\n**Expiration**: ${o.expires}`:""}`+ "\n**Premium Server**: " + o.premiumGuilds + "\n\n"
                                            : " You don't have the premium yet. Buy the premium on the [Patreon page](https://green-bot.app/premium/buy)"
                                    }`,
                                },
                            ],
                            color: "#3A871F",
                            footer: { text: "Green-Bot | green-bot.app", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) },
                        },
                    ],
                    content: null,
                });
            } else {
                if ("activate" === r || "active" === r) {
                    if (!o) return e.errorMessage("You don't have a premium subscribtion yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                    if (o.allGuilds === 0) return e.errorMessage("You need to upgrade your subscribtion to **Guild premium** to use this command\n You can upgrade your subscribtion [Patreon page](https://green-bot.app/premium/buy)");
                    if (0 === o.guildsLeft) return e.errorMessage("You have already used all your guilds pr**Green-bot Premium x1**o buy more to use this command.");
                    if (s.guildId) return e.errorMessage("This server already has premium activated.");
                    const r = e.premiumlink("premiumUser")+"action=addPremiumGuild",
                        t = { userId: e.member.id, guildId: e.guild.id };
                    await fetch(r, { method: "post", body: JSON.stringify(t), headers: { "Content-Type": "application/json" } }).catch((r) => e.logger.error(r));
                    const i = e.premiumlink("premiumGuild")+"action=add",
                        u = { guildId: e.guild.id, userId: e.member.id };
                    return (
                        await fetch(i, { method: "post", body: JSON.stringify(u), headers: { "Content-Type": "application/json" } }).catch((r) => e.logger.error(r)),
                        e.successMessage("You have successfully activated the premium on this server.")
                    );
                }
                if ("deactivate" === r) {
                    if (!o) return e.errorMessage("You don't have a premium subscribtion yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                    if (0 === o.allGuilds) return e.errorMessage("You need to upgrade your subscribtion to **Guild premium** to use this command\n You can upgrade your subscribtion [Patreon page](https://green-bot.app/premium/buy)");
                    if (o.allGuilds === o.guildsLeft || !o.premiumGuilds) return e.errorMessage("You don`t **Green-bot Premium x1**ilds premium.");
                    if (!o.premiumGuilds.includes(e.guild.id)) return e.errorMessage("You didn't make this Server Premium");
                    if (!s || !s.guildId) return e.errorMessage("The Server isn't Premium");
                    const r = e.premiumlink("premiumUser")+"action=deletePremiumGuild",
                        t = { userID: e.member.id, guildId: e.guild.id };
                    await fetch(r, { method: "post", body: JSON.stringify(t), headers: { "Content-Type": "application/json" } }).catch((r) => e.logger.error(r));
                    const i = e.premiumlink("premiumGuild") + "action=delete";
                    const u = { guildId: e.guild.id };
                    return await fetch(i, { method: "post", body: JSON.stringify(u), headers: { "Content-Type": "application/json" } }).catch((r) => e.logger.error(r)), e.successMessage("You have successfully deactivated the premium on this server.");
                }
            }
        else
            e.reply({
                embeds: [
                    {
                        author: { name: "| Premium", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }), url: Premium.invite(e.client.user.id) },
                        description: "Unlock more of Green-bot with the premium!",
                        fields: [
                            {
                                name: "How can I buy Green-bot Premium ?",
                                value:
                                    "To buy the premium version of [Green-bot](https://green-bot.app), first join the [Support server](https://discord.gg/greenbot). If you are not in the server, you won't be able to redeem your premium !\n Then go on the [Patreon page](https://green-bot.app/premium/buy) to subscribe Green-bot",
                            },
                            {
                                name: "What gives Green-bot premium ?",
                                value: "► Access to **2** new bots!\n► Access to exlusive filters\n► No restarts of the premium bot\n► No need to vote every 12h for some commands.\n► Customize everything!",
                            },
                            {
                                name: "How it works?",
                                value: `Use \`${e.guildDB.prefix}premium status\` to see your premium subription.\nUse \`${e.guildDB.prefix}premium activate\` to activate the premium on a server.\nUse \`${e.guildDB.prefix}premium deactivate\` to deactivate the premium on a server.`,
                            },
                        ],
                        color: "#3A871F",
                        footer: { text: "Green-Bot | green-bot.app", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) },
                    },
                ],
                content: null,
            });
    }
}
module.exports = Premium;
