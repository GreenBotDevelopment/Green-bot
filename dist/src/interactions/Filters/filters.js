"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Filters extends QuickCommand_1.Command {
    get name() { return "filters"; }
    get description() { return "Shows all enabled filters"; }
    get category() { return "Filters"; }
    get aliases() { return ["filter", "list"]; }
    get checks() { return { voice: true, dispatcher: true, channel: true }; }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () { const a = e.dispatcher.player.filters; e.reply({ embeds: [{ author: { name: "Enabled filters", icon_url: e.client.user.dynamicAvatarURL() }, color: 0x3A871F, description: `__• Music filters:__\nBassboost: ${a.equalizer.length ? "`Enabled`" : "`Disabled`"} | Karaoke: ${a.karaoke ? "`Enabled`" : "`Disabled`"} | Tremolo: ${a.tremolo ? "`Enabled`" : "`Disabled`"} | Vibrato: ${a.vibrato ? "`Enabled`" : "`Disabled`"}\n Distorsion: ${a.distorsion ? "`Enabled`" : "`Disabled`"} | Rotation: ${a.rotation ? "`Enabled`" : "`Disabled`"} | Nightcore: ${a.timescale ? "`Enabled`" : "`Disabled`"} | Low pass: ${a.lowPass ? "`Enabled`" : "`Disabled`"}\n\n__• Other filters:__\nVolume: **${100 * a.volume}** | Speed: **${a.timescale ? a.timescale.speed : "1"}**`, footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.dynamicAvatarURL() } }] }); });
    }
}
exports.default = Filters;
