import { Command } from "../../abstract/QuickCommand"
export default class Play extends Command {
    get name() {
        return "userinfo";
    }
    get description() {
        return "gives informations about your account or the account of someone else"
    }
    get arguments() {
        return [{ name: "user", type: 6, description: "The user you want to see the infos", required: false }];
    }
    get category() {
        return "Everyone Commands";
    }
    async run({ ctx: e }) {
        let avatarURL = e.author.avatarURL;
        let username = e.author.username;
        if (e.args[0] && e.args[0].value) {
            console.log(e.args[0].value)
            let user = (await e.client.getRESTUser(e.args[0].value))
            avatarURL = user.avatarURL;
            username = user.username;
        }
        e.send({
            components: [
                {
                    components: [
                        { url: avatarURL, label: "Avatar Link", style: 5, type: 2 },

                    ],
                    type: 1,
                },
            ],
            embeds: [
                {
                    thumbnail: { url: avatarURL },
                    color: 0x3a871f,
                    author: { name: `Informations about ${username}`, icon_url: e.author.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" },
                    footer: { text: "Green-bot.app | Manage your server with ease", icon_url: e.client.user.dynamicAvatarURL() },
                },
            ],
        })
    }
}
