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
class Distorsion extends QuickCommand_1.Command {
    get name() { return "distorsion"; }
    get description() { return "Enables/disables the distorsion filter. It can generate some pretty unique audio effects."; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () { return e.dispatcher.filters.includes("distorsion") ? (e.dispatcher.player.setDistortion(), e.dispatcher.filters = e.dispatcher.filters.filter(e => "distorsion" !== e), e.successMessage("⏱ The `Distorsion` filter has been disabled.")) : (e.dispatcher.player.setDistortion({ sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1 }), e.dispatcher.filters.push("distorsion"), e.successMessage("⏱ Enabling the `Distorsion` filter to the current song...")); });
    }
}
exports.default = Distorsion;
