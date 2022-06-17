const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {
    get name() {
        return "pitch";
    }
    get description() {
        return "Sets the pitch of the playback";
    }
    get category() {
        return "Queue Management";
    }
    get arguments() {
        return [{ name: "time", description: "The pitch", required: true, type: 4 }];
    }
    get playerCheck() {
        return { voice: !0, dispatcher: !0, channel: !0, vote: true };
    }
    async run({ ctx: e }) {
        let t = e.args[0];
        return !t || isNaN(t) || t > 5 || t < 0 ?
            e.successMessage("The duration you provided is incorrect. It must be a number beetwen **1** and **5**") :
            (e.dispatcher.player.setTimescale({ pitch: t, rate: 1, speed: 1 }), e.successMessage(`➡ Pitch of the playback set to \`${t}\``));
    }
}
module.exports = Volume;