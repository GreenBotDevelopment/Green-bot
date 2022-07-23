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
        return __awaiter(this, void 0, void 0, function* () { const s = e.dispatcher.player.filters; e.send({ embeds: [{ author: { name: "Enabled filters", icon_url: e.client.user.dynamicAvatarURL() }, color: 0x3A871F, description: `__• Music filters:__\nBassboost: ${e.dispatcher.filters.includes("bassboost") ? "`Enabled`" : "`Disabled`"} | Karaoke: ${e.dispatcher.filters.includes("karaoke") ? "`Enabled`" : "`Disabled`"} | Tremolo: ${s.tremolo ? "`Enabled`" : "`Disabled`"} | Vibrato: ${s.vibrato ? "`Enabled`" : "`Disabled`"}\n Distorsion: ${e.dispatcher.filters.includes("distorsion") ? "`Enabled`" : "`Disabled`"} | Rotation: ${s.rotation ? "`Enabled`" : "`Disabled`"} | Nightcore: ${e.dispatcher.filters.includes("nightcore") ? "`Enabled`" : "`Disabled`"} | Low pass: ${s.lowPass ? "`Enabled`" : "`Disabled`"} | 8d: ${e.dispatcher.filters.includes("8d") ? "`Enabled`" : "`Disabled`"}\n\n__• Other filters:__\nVolume: **${100 * s.volume}** | Speed: **${s.timescale ? s.timescale.speed : "1"}** | Pitch:  **${s.timescale ? s.timescale.pitch : "0"}**`, footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.dynamicAvatarURL() } }] }); });
    }
}
exports.default = Filters;
