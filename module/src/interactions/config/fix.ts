import { Command } from "../../abstract/QuickCommand";
export default class Skip extends Command {
    get name() {
        return "fix";
    }
    get description() {
        return "Fixes every single problem with the player";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get category() {
        return "Admin Commands";
    }
    get checks() {
        return { voice: true, dispatcher: true };
    }
    async run({ ctx: e }) {
        if (!e.dispatcher) return e.errorMessage("No music is being played in your server!")
        if (e.dispatcher.player.connection && 3 == e.dispatcher.player.connection.state) {
            await e.dispatcher.node.joinChannel({
                guildId: e.dispatcher.metadata.guild.id,
                shardId: e.dispatcher.metadata.guild.shard.id || 0,
                channelId: e.dispatcher.player.connection.channelId,
                deaf: true
            })
            e.dispatcher.player.resume();
            return e.successMessage("Joining your vc again!")
        }
        const channel = await e.getVoiceChannel()
        if ("rotterdam" !== channel.rtcRegion) {
           channel
                .edit({ rtcRegion: "rotterdam" })
                .catch((r) => e.errorMessage("I can't change your voice channel region because I don't have the permission to!")),
                e.successMessage("Changed voice channel region to **europe**")
            return;
        }
        e.errorMessage("I couldn't find any fix at the moment, maybe ask help in the [the support server](https://discord.gg/greenbot) if you have a problem")


    }
}
