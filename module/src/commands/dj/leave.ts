import { Command } from "../../abstract/QuickCommand";
export default class Stop extends Command {
    get name() {
        return "leave";
    }
    get description() {
        return "Leaves the current voice channel";
    }
    get aliases() {
        return ["dc", "destroy", "disconnect"];
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, channel: true };
    }
    run({ ctx: e }) {
        if (e.dispatcher) e.dispatcher.delete(), e.successMessage("⏹ The player has been successfully stopped and I left the channel!"), e.me.voiceState.channelID && e.guild.leaveVoiceChannel()
        else {
            if (!e.me.voiceState.channelID) return e.errorMessage("I am not currently playing music in this server. So it's impossible to do that");
            e.guild.leaveVoiceChannel(), e.successMessage("Disconnected!");
        }
    }
}
