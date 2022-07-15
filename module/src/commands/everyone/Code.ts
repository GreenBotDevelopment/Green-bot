import { Command } from "../../abstract/QuickCommand";
const fetch = require("node-fetch");
export default class Premium extends Command {
    get name() {
        return "code";
    }
    get category() {
        return "Everyone Commands";
    }
    get description() {
        return "Redeem a Premium Code";
    }
    get aliases() {
        return ["code"];
    }
    static invite(e) {
        return `https://discord.com/api/oauth2/authorize?client_id=${e}&permissions=139623484672&scope=bot%20applications.commands`;
    }
    async run({ ctx: e }) {
        const t = e.args[0];
            if (!["redeem"].includes(t)) return e.send({
                embeds: [
                    {
                        author: { name: "| Premium Codes", icon_url: e.client.user.dynamicAvatarURL(), url: Premium.invite(e.client.user.id) },
                        description: "Unlock more of Green-bot with the premium!",
                        fields: [
                            { 
                                name: "Premium Codes",
                                value: "Premium Codes are a new way to get Green-Bot Premium!\nFor now you can get a Premium Code only from a Developer or from winning a giveaway, in the next updates we'll make Premium Codes more accessible.\nHere is a example of Premiume Code: `3bc00ad2-9423-43e2-8b45-fbcce4aa888e`"
                            },
                            {
                                name: "Normal Premium Subscription",
                                value: "Just go to [this page](https://www.patreon.com/join/GreenBotDiscord/checkout?rid=7861330&cadence=1), checkout and access to the perks without doing any command!",
                            },
                            {
                                name: "Check if you have Premium",
                                value: `Use \`/premium status\` to see your premium subscription.\nUse \`/code redeem\` to redeem Premium Code.`,
                            },
                        ],
                        color: 0x3A871F,
                        footer: { text: "Green-Bot | green-bot.app", icon_url: e.client.user.dynamicAvatarURL() },
                    },
                ],
            });
                    if("redeem" === t) {
                        if(!e.args[1]) return e.errorMessage("You have to provide a Premium Code!");
                        const b = e.premiumlink("premiumCode") + "action=redeem",
                        r = { userId: e.member.id, codeId: e.args[1] };
                        const z = await fetch(b, { method: "post", body: JSON.stringify(r), headers: { "Content-Type": "application/json" } }).catch((e) => console.error(e));
                        const l = await z.json();
                        if(!l || !l.userId || l.startsWith("ERROR:")) return e.errorMessage("You have to provid a valid Premium Code!");
                        if(l && l.userId) e.successMessage("You have successfully redeemed your Premium Code; use /premium status to check your subscription.")
                    }
        }
}
