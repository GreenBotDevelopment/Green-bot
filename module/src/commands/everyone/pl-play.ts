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
        const t = e.args.join(" ")
        const s = await e.client.database.getUser(e.author.id);
        if (t.toLowerCase().includes("liked songs")) {
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
            let list_good = e.filterSongs(e.author.id, s.songs)
            if (list_good.fullType !== "no") {
                if (list_good.songs.length == 0) {
                    return e.errorMessage(`Your playlist can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + e.guildDB.max_songs.user + ")" : "because the current queue is already full (" + e.dispatcher.queue.length + " / "+e.dispatcher.queue.length +" tracks)"}`)
                }
            }
            e.guildDB.auto_shuffle && (list_good.songs = list_good.songs.sort(() => Math.random() - 0.5))

            let a = await e.client.queue.create(e, t);
            if(!a){
                return e.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel!\n - You may have made an error with the permissions, go to Server Settings => Roles => Green-bot and grant the administrator permission\n - If it still happens and the bot has admin permissions, use the "+e.client.printCmd("forcejoin")+" command to solve the issue")
            }

            e.successMessage(`Added [Your liked songs](https://green-bot.app) to the queue with **${list_good.songs.length}** tracks ${e.guildDB.auto_shuffle ? "🔀 and automatically shuffled it" : ""}${list_good.fullType !== "no" && `\nRemoved **${s.songs.length - list_good.songs.length}** songs because **${list_good.fullType === "user" ? "of the limitation of songs per user" : "the maximum queue size has been reached"}`}`)
            a.queue.push(...list_good.songs)
            a.tracksAdded();
            if (!a.playing) a.play();
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
            let list_good = e.filterSongs(e.author.id, a.tracks)
            if (list_good.fullType !== "no") {
                if (list_good.songs.length == 0) {
                    return e.errorMessage(`Your playlist can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + e.guildDB.max_songs.user + ")" : "because the current queue is already full (" + e.dispatcher.queue.length + " / "+ e.dispatcher.queue.length +" tracks)"}`)

                }
            }
            e.guildDB.auto_shuffle && (list_good.songs = list_good.songs.sort(() => Math.random() - 0.5))

            let r = await e.client.queue.create(e, n);
            if(!r){
                return e.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel!\n - You may have made an error with the permissions, go to Server Settings => Roles => Green-bot and grant the administrator permission\n - If it still happens and the bot has admin permissions, use the "+e.client.printCmd("forcejoin")+" command to solve the issue")
            }

            e.successMessage(`Added[${a.name}](https://green-bot.app) to the queue with **${list_good.songs.length}** tracks ${e.guildDB.auto_shuffle ? "🔀 and automatically shuffled it" : ""} ${list_good.fullType !== "no" ? `\nRemoved **${a.tracks.length - list_good.songs.length}** songs because **${list_good.fullType === "user" ? "of the limitation of songs per user" : "the maximum queue size has been reached"}` : ""}`)
            r.queue.push(...list_good.songs)
            r.playing || r.play();


            r.tracksAdded()

        }
    }
}
