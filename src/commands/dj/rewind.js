const BaseCommand = require("../../abstract/BaseCommand.js");
const ms = require("ms");
class Volume extends BaseCommand {get name() { return "rewind" }
    get description() { return "Rewind a specific amount of time into the track. Default is 10 seconds. (Does not work for livestreams!)" }get category() { return "Queue Management" }
    get arguments() { return [{ name: "time", description: "The time in miliseconds of the playback", required: null }] }get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true } }
    run({ ctx: e }) { let s = e.args[0] || "10s"; if (!s.includes("m") && !s.includes("s") && !s.includes("h")) s = s + "s"; const time = ms(s); if (!time || isNaN(time) || time < 0) return e.errorMessage("The duration you provided is incorrect. Please provide a number of seconds."); if (time > e.dispatcher.current.info.length) return e.errorMessage("Your provided a duration higher than the current song duration.");
        e.dispatcher.player.seekTo(parseInt(e.dispatcher.player.position - time));
        e.successMessage(`⏪ Rewinded the music of \`${s}\``) } }
module.exports = Volume;