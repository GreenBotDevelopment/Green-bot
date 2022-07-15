import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "volume";
    }
    get description() {
        return "Sets the volume of this playback.";
    }
    get category() {
        return "Queue Management";
    }
    get aliases() {
        return ["v", "vol", "volume"];
    }
    get arguments() {
        return [{ name: "value", description: "The new volume you want me to set to [1-200]" }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true };
    }
    static inRange(e, t, r) {
        return (e - t) * (e - r) <= 0;
    }
    run({ ctx: e }) {
        let t = e.args[0];
        return t
            ? ("up" === t && (t = 100 * e.dispatcher.player.filters.volume + 10),
              "down" === t && (t = 100 * e.dispatcher.player.filters.volume - 10),
              "max" === t && (t = 200),
              ("reset" !== t && "min" !== t) || (t = 30),
              isNaN(t) || !Volume.inRange(t, 1, 200)
                  ? e.errorMessage("The volume you provided is incorrect. It must be a number beetwen **1** and **200**")
                  : (e.dispatcher.player.setVolume(t / 100), (e.dispatcher.metadata.guildDB.defaultVolume = t), e.successMessage(`🔊 | The playback volume is now set to \`${t}%\``)))
            : e.successMessage(`🔊 Current volume: **${100 * e.dispatcher.player.filters.volume}%**`);
    }
}
