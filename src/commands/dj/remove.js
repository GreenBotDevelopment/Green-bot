const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "remove" }
    get description() { return "Remove a music from the queue" }get aliases() { return ["rem"] }
    get category() { return "Queue Management" }get arguments() { return [{ name: "track", description: "The position or the track of the track you want to remove", required: !0 }] }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0 } }
    run({ ctx: e }) { if (isNaN(e.args[0])) { let r = e.dispatcher.queue.find(r => r.info.title.toLowerCase().includes(e.args.join(" "))); if (!r) return e.errorMessage("No tracks");
            e.dispatcher.remove(r), e.successMessage(`Removed [${r.info.title}](https://discord.gg/greenbot) from the queue`) } else if (e.args.length > 1) { let r = 0,
                t = []; if (e.args.forEach(o => { let s = o.replace("#", "") - 1; if (!e.dispatcher.queue[s]) return console.log(`${o} not found`);
                    r++, t.push(e.dispatcher.queue[s]) }), 0 == r) return e.errorMessage("Please provide at least one valid track number");
            t.forEach(r => { e.dispatcher.remove(r) }), e.successMessage(`Removed ${r} songs from the queue!`) } else { let r = e.args[0].replace("#", "") - 1; const t = e.dispatcher.queue[r]; if (!t) return e.errorMessage("There is no track with this number in your queue.");
            e.dispatcher.remove(r), e.successMessage(`Removed [${t.info.title}](https://discord.gg/greenbot) from the queue`) } } }
module.exports = Volume;