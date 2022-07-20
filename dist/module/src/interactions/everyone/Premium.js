"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
const fetch = require("node-fetch");
class Premium extends QuickCommand_1.Command {
    get name() {
        return "premium";
    }
    get arguments() {
        return [
            {
                name: "action",
                type: 3,
                required: true,
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
        const t = e.args[0].value;
        const r = e.premiumlink("premiumUser") + "userId=" + e.member.id, i = await fetch(r).catch((t) => e.logger.error(t)), o = await i.json(), u = e.premiumlink("premiumGuild") + "guildId=" + e.guild.id, a = await fetch(u).catch((t) => e.logger.error(t)), s = await a.json();
        if (!["status", "activate", "active", "deactivate"].includes(t))
            return e.errorMessage("Please provide a valid action: status, activate or deactivate");
        if (t)
            if ("status" === t) {
                if (!o)
                    return e.errorMessage("You don't have a premium subscription yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                e.send({
                    embeds: [
                        {
                            author: {
                                name: "Green-Bot Premium",
                                icon_url: e.client.user.dynamicAvatarURL(),
                                url: "https://discord.com/oauth2/authorize?client_id=901466922820988968&scope=bot&permissions=19456",
                            },
                            description: "Your Premium subscription Status",
                            fields: [
                                {
                                    name: "Status",
                                    value: `${o
                                        ? "✅ You currently have the premium\n\n**Tier**: " +
                                            o.tiers.map(t => t.name + " (" + t.id + "), ") +
                                            "\n**Guilds left**: " +
                                            o.guildsLeft + "/" + o.allGuilds +
                                            "\n**Lifetime**: " + o.lifetime +
                                            "\n**Custom**: " + o.custom +
                                            `${o.expires ? `\n**Expiration**: <t:${o.expires}:f> (<t:${o.expires}:R>)` : ""}` +
                                            "\n**Premium Server**: " +
                                            o.premiumGuilds +
                                            "\n\n"
                                        : " You don't have the premium yet. Buy the premium on the [Patreon page](https://green-bot.app/premium/buy)"}`,
                                },
                            ],
                            color: 0x3A871F,
                            footer: { text: "Green-Bot | green-bot.app", icon_url: e.client.user.dynamicAvatarURL() },
                        },
                    ],
                });
            }
            else {
                if ("activate" === t || "active" === t) {
                    if (!o)
                        return e.errorMessage("You don't have a premium subscription yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                    if (0 === o.allGuilds)
                        return e.errorMessage("You need to upgrade your subscription to **Guild premium** to use this command\n You can upgrade your subscription [Patreon page](https://green-bot.app/premium/buy)");
                    if (0 === o.guildsLeft)
                        return e.errorMessage("You have already used all your guilds pr**Green-bot Premium x1**o buy more to use this command.");
                    if (s.guildId)
                        return e.errorMessage("This server already has premium activated.");
                    const t = e.premiumlink("premiumUser") + "action=addPremiumGuild", r = { userId: e.member.id, guildId: e.guild.id };
                    await fetch(t, { method: "post", body: JSON.stringify(r), headers: { "Content-Type": "application/json" } }).catch((t) => e.logger.error(t));
                    const i = e.premiumlink("premiumGuild") + "action=add", u = { guildId: e.guild.id, userId: e.member.id };
                    return (await fetch(i, { method: "post", body: JSON.stringify(u), headers: { "Content-Type": "application/json" } }).catch((t) => e.logger.error(t)),
                        e.successMessage("You have successfully activated the premium on this server."));
                }
                if ("deactivate" === t) {
                    if (!o)
                        return e.errorMessage("You don't have a premium subscription yet, you need to buy one on the [Patreon page](https://green-bot.app/premium/buy)");
                    if (0 === o.allGuilds)
                        return e.errorMessage("You need to upgrade your subscription to **Guild premium** to use this command\n You can upgrade your subscription [Patreon page](https://green-bot.app/premium/buy)");
                    if (true !== o.owner && (o.allGuilds === o.guildsLeft || !o.premiumGuilds))
                        return e.errorMessage("You don`t have used your guilds premium.");
                    if (!o.premiumGuilds.includes(e.guild.id))
                        return e.errorMessage("You didn't make this Server Premium");
                    if (!s || !s.guildId)
                        return e.errorMessage("The Server isn't Premium");
                    const t = e.premiumlink("premiumUser") + "action=deletePremiumGuild", r = { userId: e.member.id, guildId: e.guild.id };
                    await fetch(t, { method: "post", body: JSON.stringify(r), headers: { "Content-Type": "application/json" } }).catch((t) => e.logger.error(t));
                    const i = e.premiumlink("premiumGuild") + "action=delete", u = { guildId: e.guild.id };
                    return (await fetch(i, { method: "post", body: JSON.stringify(u), headers: { "Content-Type": "application/json" } }).catch((t) => e.logger.error(t)),
                        e.successMessage("You have successfully deactivated the premium on this server."));
                }
            }
        else
            e.reply({
                embeds: [
                    {
                        author: { name: "| Premium", icon_url: e.client.user.dynamicAvatarURL(), url: Premium.invite(e.client.user.id) },
                        description: "Unlock more of Green-bot with the premium!",
                        fields: [
                            {
                                name: "How can I buy Green-bot Premium ?",
                                value: "To buy the premium version of [Green-bot](https://green-bot.app), first join the [Support server](https://discord.gg/greenbot). If you are not in the server, you won't be able to redeem your premium !\n Then go on the [Patreon page](https://green-bot.app/premium/buy) to subscribe Green-bot",
                            },
                            {
                                name: "What gives Green-bot premium ?",
                                value: "► Access to **2** new bots!\n► Access to exlusive filters\n► No restarts of the premium bot\n► No need to vote every 12h for some commands.\n► Customize everything!",
                            },
                            {
                                name: "How it works?",
                                value: `Use \`/premium status\` to see your premium subription.\nUse \`/premium activate\` to activate the premium on a server.\nUse \`/premium deactivate\` to deactivate the premium on a server.`,
                            },
                        ],
                        color: 0x3a871f,
                        footer: { text: "Green-Bot | green-bot.app", icon_url: e.client.user.dynamicAvatarURL() },
                    },
                ],
                content: null,
            });
    }
}
exports.default = Premium;
