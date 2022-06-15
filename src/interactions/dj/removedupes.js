const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "removedupes" }
    get description() { return "Removes all duplicate tracks from the queue" }get aliases() { return ["remdupes", "dupes"] }
    get category() { return "Queue Management" }get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true, dj: !0 } }
    run({ ctx: e }) { e.successMessage("⏱ Removing duplicates. Please wait"); const s = []; let r = 0;
        e.dispatcher.queue.forEach(t => { s.includes(t.url) ? (e.dispatcher.remove(t), r++) : s.push(t.url, t) }), e.successMessage(`I removed **${r}** duplicates songs`) } }
module.exports = Volume;