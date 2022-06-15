const BaseCommand = require("../../abstract/BaseCommand.js");
class Skip extends BaseCommand {get name() { return "filters" }
    get description() { return "Shows all enabled filters" }get category() { return "Filters" }
    get aliases() { return ["filter", "list"] }get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0 } }
    async run({ ctx: e }) { const a = e.dispatcher.player.filters;
        e.reply({ embeds: [{ author: { name: "Enabled filters", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) }, color: "#3A871F", description: `__• Music filters:__\nBassboost: ${a.equalizer.length?"`Enabled`":"`Disabled`"} | Karaoke: ${a.karaoke?"`Enabled`":"`Disabled`"} | Tremolo: ${a.tremolo?"`Enabled`":"`Disabled`"} | Vibrato: ${a.vibrato?"`Enabled`":"`Disabled`"}\n Distorsion: ${a.distorsion?"`Enabled`":"`Disabled`"} | Rotation: ${a.rotation?"`Enabled`":"`Disabled`"} | Nightcore: ${a.timescale?"`Enabled`":"`Disabled`"} | Low pass: ${a.lowPass?"`Enabled`":"`Disabled`"}\n\n__• Other filters:__\nVolume: **${100*a.volume}** | Speed: **${a.timescale?a.timescale.speed:"1"}**`,footer:{text:"Green-bot | Free music for everyone!",icon_url:e.client.user.displayAvatarURL({dynamic:!0,size:512})}}]})}}module.exports=Skip;