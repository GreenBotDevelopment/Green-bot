import { Command } from "../../abstract/QuickCommand"
export default class Play extends Command {
    get name() {
        return "avatar";
    }
    get description() {
        return "gives your avatar or someones else avatar"
    }
    get arguments() {
        return [{ name: "user", type: 6, description: "The user you want to see the avatar", required: false }];
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
                    image: { url: avatarURL.replace("128","1024") },
                    color: 0x3a871f,
                    author: { name: `${username}'s avatar`, icon_url: avatarURL, url: "https://discord.gg/synAXZtQHM" },
                    footer: { text: "Green-bot.app | Manage your server with ease", icon_url: e.client.user.dynamicAvatarURL() },
                },
            ],
        })
    }
}
