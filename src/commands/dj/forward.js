const BaseCommand = require("../../abstract/BaseCommand.js"),
    ms = require("ms");
class Volume extends BaseCommand {get name() { return "forward" }
    get description() { return "Forward a specific amount of time into the track. Default is 10 seconds. (Does not work for livestreams!)" }get aliases() { return ["ff", "fastforward"] }
    get category() { return "Queue Management" }get arguments() { return [{ name: "time", description: "The time in miliseconds of the playback (1000 = 1s so 10000=10s)", required: null }] }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true } }
    run({ ctx: e }) { let r = e.args[0] || "10s";
        r.includes("m") || r.includes("s") || r.includes("h") || (r += "s"); const s = ms(r); return !s || isNaN(s) || s < 0 ? e.errorMessage("The duration you provided is incorrect. Please provide a number of seconds.") : s > e.dispatcher.current.info.length ? e.errorMessage("Your provided a duration higher than the current song duration.") : (e.dispatcher.player.seekTo(parseInt(e.dispatcher.player.position + s)), void e.successMessage(`⏭ Fast forwarded the music of \`${r}\``)) } }
module.exports = Volume;