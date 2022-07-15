import { Constants } from "eris";
import { Command } from "../../abstract/QuickCommand";
import { Context } from "../../modules/Context";
export default class Queue extends Command {
    get name() {
        return "pl-play";
    }
    get description() {
        return "Play a playlist";
    }
    get aliases() {
        return ["pl-p", "pl-play", "pl-load", "plp"];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true };
    }
    get arguments() {
        return [{ name: "playlist_name", description: "The name of the playlist you want to play", required: true, type: 3 }];
    }
    async run({ ctx: e }) {
        const t = e.args[0].value;
        const s = await e.client.database.getUser(e.author.id);
        if ("liked-songs" === t) {
            if (0 == s.songs.length) return e.errorMessage("You don't have any liked song yet!");
            const t = e.client.shoukaku.getNode();
            if (!t) return e.errorMessage("No nodes are available yet! You can report this error is [Green bot Server](https://discord.gg/greenbot)");
            if (!e.dispatcher) {
                const channel = await e.getVoiceChannel();
                if (!e.client.hasBotPerm(e, "voiceConnect", channel))
                return e.errorMessage(
                    "I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`"
                );
            if (!e.client.hasBotPerm(e, "voiceSpeak", channel) && 13 !== channel.type)
                return e.errorMessage(
                    "I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions"
                );
                if (e.guildDB.vcs.length && !e.guildDB.vcs.includes(e.member.voiceState.channelID))
                    return e.errorMessage(
                        e.guildDB.vcs.length > 1
                            ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${e.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                            : `I can only play music in the <#${e.guildDB.vcs[0]}> channel.`
                    );
            }
            const a = await e.client.queue.create(e, t);
            
            e.successMessage(`Added [Your liked songs](https://green-bot.app) to the queue with **${s.songs.length}** tracks ${e.guildDB.auto_shuffle ? "🔀 and automatically shuffled it" : ""}`),
                s.songs.forEach((e) => {
                    a.queue.push(e);
                }),
                e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                a.tracksAdded(),
                setTimeout(() => {
                    a.playing || a.play();
                }, 1100);
        } else {
            if (!s || !s.playlists.find((e) => e.name.toLowerCase() === t.toLowerCase())) return e.errorMessage(`You don't have any playlist called **${t.slice(0, 100)}** yet!`);
            if (!e.dispatcher) {
                const channel = await e.getVoiceChannel();
                if (!channel.permissionsOf(e.client.user.id).has(Constants.Permissions.voiceConnect))
                    return e.errorMessage(
                        "I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`"
                    );
                if (!channel.permissionsOf(e.client.user.id).has(Constants.Permissions.voiceSpeak) && 13 !== channel.type)
                    return e.errorMessage(
                        "I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions"
                    );
                if (e.guildDB.vcs.length && !e.guildDB.vcs.includes(e.member.voiceState.channelID))
                    return e.errorMessage(
                        e.guildDB.vcs.length > 1
                            ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${e.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                            : `I can only play music in the <#${e.guildDB.vcs[0]}> channel.`
                    );
            }
            const a = s.playlists.find((e) => e.name === t);
            if (!a || 0 == a.tracks.length) return e.errorMessage("Your playlist is empty! Add some songs before playing it!");
            const n = e.client.shoukaku.getNode();
            if (!n) return e.errorMessage("No nodes are available yet! You can report this error in [Green bot Server](https://discord.gg/greenbot)");
            const r = await e.client.queue.create(e, n);
            e.successMessage(`Added [${a.name}](https://green-bot.app) to the queue with **${a.tracks.length}** tracks ${e.guildDB.auto_shuffle ? "🔀 and automatically shuffled it" : ""}`),
                a.tracks.forEach((e) => {
                    r.queue.push(e);
                }),
                e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                r.tracksAdded(),
                setTimeout(() => {
                    r.playing || r.play();
                }, 1100);
        }
    }
}
