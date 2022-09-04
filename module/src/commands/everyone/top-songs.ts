import { Command } from "../../abstract/QuickCommand";
export default class Queue extends Command {
    get name() {
        return "top-songs";
    }
    get description() {
        return "Shows the top songs you listen to";
    }
    get category() {
        return "Everyone Commands";
    }
    async run({ ctx: e }) {
        const t = await e.client.database.getUser(e.author.id);
        if (!t || t.played_music.length == 0) return e.errorMessage("You don't have listenned to any song yet");
        const songs = e.client.database.getTopSongs(t.played_music, true)
        e.send({
            embeds: [
                {
                    description: songs.slice(0,14).join("\n"),
                    author: { name: "Your Top Songs", icon_url: e.author.dynamicAvatarURL() },
                   
                    color: 0x3a871f,
                },
            ],
 components: [
                {
                    components: [
                        { url: "https://dash.green-bot.app", label: "View all Online", style: 5, type: 2 },

                    ],
                    type: 1,
                },
            ],        });
    }
}
