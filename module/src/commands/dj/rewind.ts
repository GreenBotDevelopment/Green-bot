import { Command } from "../../abstract/QuickCommand";
const ms = require("ms");
export default class Volume extends Command {
    get name() {
        return "rewind";
    }
    get description() {
        return "Rewind a specific amount of time into the track. Default is 10 seconds. (Does not work for livestreams!)";
    }
    get category() {
        return "Queue Management";
    }
    get arguments() {
        return [{ name: "time", description: "The time in miliseconds of the playback", required: null }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        let s = e.args[0] || "10s";
        if (!s.includes("m") && !s.includes("s") && !s.includes("h")) s = s + "s";
        const time = ms(s);
        if (!time || isNaN(time) || time < 0) return e.errorMessage("The duration you provided is incorrect. Please provide a number of seconds.");
        if (time > e.dispatcher.current.info.length) return e.errorMessage("Your provided a duration higher than the current song duration.");
        e.dispatcher.player.seekTo(e.dispatcher.player.position - time);
        e.successMessage(`⏪ Rewinded the music of \`${s}\``);
    }
}
