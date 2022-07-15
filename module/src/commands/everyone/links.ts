import { Command } from "../../abstract/QuickCommand";
export default class Help extends Command {
    get name() {
        return "links";
    }
    get category() {
        return "Everyone Commands";
    }
    get aliases() {
        return ["add", "invite", "getbot", "support", "discord", "website", "inv"];
    }
    get description() {
        return "Displays all useful links about the bot";
    }
    run({ ctx: e }) {
        e.send({
            embeds: [
                {
                    author: { name: "Useful links", icon_url: e.client.user.dynamicAvatarURL() },
                    color: 0x3a871f,
                    description:
                        "[Green-bot](https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot%20applications.commands) | [Green-bot 2](https://discord.com/oauth2/authorize?client_id=902201674263851049&permissions=8&scope=bot%20applications.commands) | [Green-bot 3](https://discord.com/oauth2/authorize?client_id=906246223504240641&permissions=8&scope=bot%20applications.commands) | [Green-bot 4](https://discord.com/oauth2/authorize?client_id=913065900125597706&response_type=code&permissions=8&scope=applications.commands+bot)\n[Support Server](https://discord.gg/greenbot) | [Guide](https://guide.green-bot.app) | [Premium](https://green-bot.app/premium) | [Vote](https://top.gg/bot/783708073390112830/vote)",
                    footer: { text: "• Get more links at green-bot.app/commands", icon_url: e.client.user.dynamicAvatarURL() },
                },
            ],
        });
    }
}

