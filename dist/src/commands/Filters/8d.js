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
class EightD extends QuickCommand_1.Command {
    get name() { return "8d"; }
    get description() { return "Enables/disables the 8d filter. It can generate some pretty unique audio effects."; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () { return e.dispatcher.filters.includes("8d") ? (e.dispatcher.player.setRotation(), e.dispatcher.filters = e.dispatcher.filters.filter(e => "8d" !== e), e.successMessage("⏱ The `8d` filter has been disabled.")) : (e.dispatcher.player.setRotation({ rotationHz: .2 }), e.dispatcher.filters.push("8d"), e.successMessage("⏱ Enabling the `8d` filter to the current song...")); });
    }
}
exports.default = EightD;
