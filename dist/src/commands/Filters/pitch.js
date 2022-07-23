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
class Pitch extends QuickCommand_1.Command {
    get name() { return "pitch"; }
    get description() { return "Sets the pitch of the playback"; }
    get category() { return "Queue Management"; }
    get arguments() { return [{ name: "time", description: "The pitch", required: true }]; }
    get checks() { return { voice: true, dispatcher: true, channel: true, premium: true }; }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () { const t = e.args[0]; return !t || isNaN(t) || t > 5 || t < 0 ? e.successMessage("The duration you provided is incorrect. It must be a number beetwen **1** and **5**") : (e.dispatcher.player.setTimescale({ pitch: t, rate: 1, speed: 1 }), e.successMessage(`➡ Pitch of the playback set to \`${t}\``)); });
    }
}
exports.default = Pitch;
